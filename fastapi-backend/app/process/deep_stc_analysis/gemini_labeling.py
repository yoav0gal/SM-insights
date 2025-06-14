from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from bertopic.representation import LangChain
import os
import traceback

print (os.getenv("GOOGLE_API_KEY"))
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

# Load QA chain
chain = load_qa_chain(llm, chain_type="stuff")

system_prompt = """
<s>[INST] <<SYS>>
You are a helpful, respectful and honest assistant for labeling topics.
<</SYS>>
"""

# Example prompt demonstrating the output we are looking for
example_prompt = """
I have a topic that contains the following documents:
- Traditional diets in most cultures were primarily plant-based with a little meat on top, but with the rise of industrial style meat production and factory farming, meat has become a staple food.
- Meat, but especially beef, is the word food in terms of emissions.
- Eating meat doesn't make you a bad person, not eating meat doesn't make you a good one.

The topic is described by the following keywords: 'meat, beef, eat, eating, emissions, steak, food, health, processed, chicken'.

Based on the information about the topic above, please create a short label of this topic. Make sure you to only return the label and nothing more.

[/INST] Environmental impacts of eating meat
"""

# Our main prompt with documents ([DOCUMENTS]) and keywords ([KEYWORDS]) tags
main_prompt = """
[INST]
I have a topic that contains the following documents:
[DOCUMENTS]

The topic is described by the following keywords: '[KEYWORDS]'.

Based on the information about the topic above, please create a short label of this topic. Make sure you to only return the label and nothing more.
[/INST]
"""

class SafeLangChain:
    def __init__(self, chain, prompt_template):
        self.chain = chain
        self.prompt_template = prompt_template

    def __call__(self, docs, keywords, **kwargs):
        try:
            prompt = self.prompt_template.replace("[DOCUMENTS]", "\n- " + "\n- ".join(docs[:5]))
            prompt = prompt.replace("[KEYWORDS]", ", ".join(keywords[:10]))
            print("🟡 Sending prompt to Gemini:\n", prompt[:300])
            return self.chain.run({"input": prompt})
        except Exception as e:
            print("🔴 Gemini chain failed:", e)
            traceback.print_exc()
            return "general topic"

prompt = system_prompt + example_prompt + main_prompt
# Create your representation model
representation_model = LangChain(SafeLangChain(chain, prompt), prompt=prompt)