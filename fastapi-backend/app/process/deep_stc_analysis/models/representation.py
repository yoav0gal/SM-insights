from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from bertopic.representation import LangChain
import os
import traceback

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
description_example_prompt = """
I have a topic that contains the following documents:
- Traditional diets in most cultures were primarily plant-based with a little meat on top, but with the rise of industrial style meat production and factory farming, meat has become a staple food.
- Meat, but especially beef, is the word food in terms of emissions.
- Eating meat doesn't make you a bad person, not eating meat doesn't make you a good one.

The topic is described by the following keywords: 'meat, beef, eat, eating, emissions, steak, food, health, processed, chicken'.

Based on the information about the topic above, please create a descriptive summary of this topic in one to two sentences. Be concise but informative, providing enough context to understand what the topic is about.

[/INST] Environmental impacts of eating meat, how industrial meat production and factory farming have increased emissions, with beef being especially harmful to the environment.
"""

# Our main prompt with documents ([DOCUMENTS]) and keywords ([KEYWORDS]) tags
description_main_prompt = """
[INST]
I have a topic that contains the following documents:
[DOCUMENTS]

The topic is described by the following keywords: '[KEYWORDS]'.

Based on the information about the topic above, please create a descriptive summary of this topic in one to two sentences. Be concise but informative, providing enough context to understand what the topic is about.
[/INST]
"""

label_example_prompt = """
I have a topic that contains the following documents:
- Traditional diets in most cultures were primarily plant-based with a little meat on top, but with the rise of industrial style meat production and factory farming, meat has become a staple food.
- Meat, but especially beef, is the word food in terms of emissions.
- Eating meat doesn't make you a bad person, not eating meat doesn't make you a good one.

The topic is described by the following keywords: 'meat, beef, eat, eating, emissions, steak, food, health, processed, chicken'.

Based on the information about the topic above, please create a short label of this topic. Make sure you to only return the label and nothing more.

[/INST] Environmental impacts of eating meat
"""

label_main_prompt = """
[INST]
I have a topic that contains the following documents:
[DOCUMENTS]

The topic is described by the following keywords: '[KEYWORDS]'.


Based on the information about the topic above, please create a short label of this topic. Make sure you to only return the label and nothing more.
[/INST]
"""

label_prompt = system_prompt + label_example_prompt + label_main_prompt
description_prompt = system_prompt + description_example_prompt + description_main_prompt
# Create your representation model
representation_model = {
    "Main": LangChain(chain, prompt=label_prompt),
    "Description": LangChain(chain, prompt=description_prompt)
}





