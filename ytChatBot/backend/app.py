from flask import Flask, request, jsonify
from flask_cors import CORS

from main import (

    load_pipeline,

    ask_question,

    chain,

    memory

)

app = Flask(__name__)

CORS(app)

retriever = None

global_retriever = None

video_id = None

summary = None

#we create these becuse we want to load the pipeline only once when the first request comes in, and then reuse it for subsequent requests, instead of loading it every time a question is asked.
#When user loads video:
# we must store:

# retriever
# global retriever
# video_id

# so /ask route can use them later.

#home route 
@app.route("/")

def home():

    return "YT AI Copilot Backend Running"



#load video route, 
#This runs:

# transcript extraction
# embeddings
# summary
# retriever creation

# ALL backend logic.
@app.route("/load_video", methods=["POST"])

def load_video():

    global retriever
    global global_retriever
    global video_id
    global summary

    try:

        data = request.json

        url = data["url"]

        result = load_pipeline(url)

        retriever = result["retriever"]

        global_retriever = result["global_retriever"]

        video_id = result["video_id"]
        
        summary = result["summary"]

        return jsonify({

            "summary": summary

        })

    except Exception as e:

      print("FULL ERROR:", e)

      import traceback

      traceback.print_exc()

      return jsonify({

        "error": str(e)

      }), 500
        
        
#ask question route
@app.route("/ask", methods=["POST"])

def ask():

    try:

        data = request.json

        query = data["query"]

        result = ask_question(

            query,

            retriever,

            global_retriever,

            chain,

            memory,

            video_id,
            
            summary

        )

        return jsonify(result)

    except Exception as e:

     import traceback

     print("\n\n===== FULL ERROR =====")

     traceback.print_exc()

     print("======================\n\n")

     return jsonify({

        "error": str(e)

     }), 500
        
#run the app        
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
        
