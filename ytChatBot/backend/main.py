from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings
)

from langchain_huggingface import HuggingFaceEmbeddings

from dotenv import load_dotenv

from langchain_community.vectorstores import Chroma

from youtube_transcript_api import YouTubeTranscriptApi

from langchain_core.documents import Document

from langchain_core.prompts import ChatPromptTemplate

from langchain_core.output_parsers import StrOutputParser

#from langchain_community.retrievers import MultiQueryRetriever


from langchain_text_splitters import RecursiveCharacterTextSplitter


from langchain_classic.memory import ConversationBufferMemory

import os

import logging

#from pytube import YouTube #to get the title and other metadata of the video


# -----------------------------------
# LOAD ENV VARIABLES
# -----------------------------------

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO
)

# -----------------------------------
# CREATE MEMORY
# -----------------------------------

memory = ConversationBufferMemory(
    return_messages=True
)

# -----------------------------------
# CREATE LLM
# -----------------------------------

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0.7
)


# -----------------------------------
# GET YOUTUBE URL, and extract video metadata, create extract function 
# -----------------------------------

def extract_transcript(url):

   video_id = url.split("v=")[-1].split("&")[0]

   ytt = YouTubeTranscriptApi()

   try:

      transcript_list = ytt.fetch(
          video_id,
          languages=["en", "hi"]
    )

      transcript = " ".join(
          [t.text for t in transcript_list]
    ) 

   except Exception as e:
       print(e)
       #exit() dont use exit as it may crash the flask server even if one transcript is not available,
       raise Exception("Transcript not available for this video")
   return transcript, video_id


# -----------------------------------
# CREATE DOCUMENT
# -----------------------------------
def create_document(transcript, video_id, url):
    
   doc = Document(
      page_content=transcript,
      metadata={
        "source": url,
        "video_id": video_id,
        #"title": video_title
     }
    )#we want to check if video already present in vector database, if yes then we can skip the embedding and vector store creation steps and directly use the retriever to get the relevant information from the transcript, hence we are adding video_id as metadata to the document so that we can check for it in the vector database later


  # -----------------------------------
  # SPLIT INTO CHUNKS
  # -----------------------------------

   text_splitter = RecursiveCharacterTextSplitter(
      chunk_size=2000,
      chunk_overlap=100
    ) 

   docs = text_splitter.split_documents([doc])
   return docs


  # -----------------------------------
  # CREATE EMBEDDINGS
  # -----------------------------------

def create_vector_store(docs, video_id):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

  # -----------------------------------
  # LOAD / CREATE VECTOR DATABASE
  # -----------------------------------

    vector_db = Chroma(

      collection_name="yt-transcript",

      persist_directory="./chroma_db",

      embedding_function=embeddings
    )


  # -----------------------------------
  # CHECK IF VIDEO EXISTS
  # -----------------------------------

    existing_docs = vector_db.get(
      where={"video_id": video_id}
    )


   # -----------------------------------
   # ADD ONLY IF NOT PRESENT
   # -----------------------------------

    if len(existing_docs["ids"]) == 0:

     logging.info("\nAdding new video to database...\n")

     vector_db.add_documents(docs)

    else:

     logging.info("\nVideo already exists in database.\n")
     
    return vector_db
    
 #problems if persistent db not present: noisy retrieval, duplicate entries for same video, increased cost due to embedding and storing in vector database every time, slower response time due to embedding and storing in vector database every time, better to check if video already present in vector database and only add if not present, this will help to reduce noise in retrieval, avoid duplicate entries for same video, reduce cost and improve response time by avoiding unnecessary embedding and storing in vector database every time.


# -----------------------------------
# CREATE RETRIEVER
# -----------------------------------

def create_retriever(vector_db, video_id):

  #retriever = MultiQueryRetriever.from_llm(

    # llm=ChatGoogleGenerativeAI(
    #     model="gemini-2.5-flash",
    #     temperature=0.7
    # ),

    # retriever=vector_db.as_retriever(
    #     search_kwargs={"k": 3, "filter": {"video_id": video_id}},
    #        search_type="mmr",
        
    #   )
    #)

   retriever = vector_db.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 3, "filter": {"video_id": video_id}}
   )

   # global_retriever = MultiQueryRetriever.from_llm(

   #     llm=ChatGoogleGenerativeAI(
   #         model="gemini-2.5-flash",
   #         temperature=0.7
   #     ),

   #     retriever=vector_db.as_retriever(
   #         search_kwargs={"k": 8},
   #         search_type="mmr",
   #     )
   # )

   global_retriever = vector_db.as_retriever(

    search_type="mmr",
    search_kwargs={"k": 15}

  )
   
   return retriever, global_retriever


# -----------------------------------
# CREATE Summary Prompt and Question PROMPT
# -----------------------------------

# -----------------------------------
# CREATE SUMMARY PROMPT
# -----------------------------------

def generate_summary(transcript):
    summary_prompt = ChatPromptTemplate.from_messages([

      (
        "system",

     """
        Summarize the following YouTube transcript.

        Include:
        1. Main topic
        2. Key concepts
        3. Important insights

        Transcript:
        {transcript}
       """
      ),

      (
        "human",

        "Generate a concise summary of the video."
      )

  ])

    summary_chain = summary_prompt | llm | StrOutputParser()

    summary = summary_chain.invoke({
    "transcript": transcript
   })

    return summary



prompt = ChatPromptTemplate.from_messages([

    (
        "system",

        """
You are an AI research assistant.

Answer the user's question ONLY using
the current video's transcript context.

Use previous conversation history
when needed.

Chat History:
{chat_history}

Current Video Context:
{context}
"""
    ),

    (
        "human",
        "{query}"
    )
])



#Creating a Load pipeline

def load_pipeline(url):

    transcript, video_id = extract_transcript(url)

    docs = create_document(transcript, video_id, url)

    vector_db = create_vector_store(docs, video_id)

    retriever, global_retriever = create_retriever(vector_db, video_id)

    summary = generate_summary(transcript)

    return {

    "retriever": retriever,

    "global_retriever": global_retriever,

    "summary": summary,

    "video_id": video_id
 
 }


# -----------------------------------
# CREATE CHAIN
# -----------------------------------

chain = prompt | llm | StrOutputParser()


# -----------------------------------
# CHAT LOOP
# -----------------------------------

def ask_question(

    query,

    retriever,

    global_retriever,

    chain,

    memory,

    video_id,
    
    summary

 ):

    # -----------------------------
    # RETRIEVE DOCUMENTS
    # -----------------------------

    results = retriever.invoke(query)

    related_results = global_retriever.invoke(summary)


    # -----------------------------
    # CREATE CONTEXT
    # -----------------------------

    context = "\n\n".join([

        doc.page_content

        for doc in results

    ])


    # -----------------------------
    # LOAD MEMORY
    # -----------------------------

    chat_history = memory.load_memory_variables(

        {}

    )["history"]


    # -----------------------------
    # GENERATE RESPONSE
    # -----------------------------

    result = chain.invoke({

        "context": context,

        "query": query,

        "chat_history": chat_history

    })


    # -----------------------------
    # SAVE MEMORY
    # -----------------------------

    memory.save_context(

        {"input": query},

        {"output": result}

    )


    # -----------------------------
    # RELATED VIDEOS
    # -----------------------------

    related_videos = []

    shown_videos = set()


    for doc in related_results:

        url = doc.metadata.get(
            "source",
            ""
        )

        if doc.metadata.get(
            "video_id"
        ) == video_id:

            continue

        if url in shown_videos:

            continue

        related_videos.append(url)

        shown_videos.add(url)


    # -----------------------------
    # RETURN RESPONSE
    # ----------------------------- 

    return {

        "answer": result,

        "related_videos": related_videos

    }