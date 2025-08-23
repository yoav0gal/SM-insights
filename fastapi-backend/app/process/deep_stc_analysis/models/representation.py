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
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

# Load QA chain
chain = load_qa_chain(llm, chain_type="stuff")

system_prompt = """
<s>[INST] <<SYS>>
You label topics from short document sets.
Rules:
1) Output exactly one sentence (6–12 words).
2) Return the label text only — no quotes or extras.
3) No lead-ins like "This topic...", no endings like "in this topic".
4) Be specific and informative; avoid bland labels.
5) English only; use Title Case or Sentence Case.
<</SYS>>
"""

example_prompt = """
I have a topic that contains the following documents:
- Traditional diets in most cultures were primarily plant-based with a little meat on top, but with the rise of industrial style meat production and factory farming, meat has become a staple food.
- Meat, but especially beef, is the worst food in terms of emissions.
- Eating meat doesn't make you a bad person, not eating meat doesn't make you a good one.

Based on the information about the topic above, please create a short label of this topic. Make sure you to only return the label and nothing more.

[/INST] Environmental and Ethical Debates Around Meat Consumption
"""

example_prompt_2 = """
I have a topic that contains the following documents:
- Several posts complain about hidden fees and surge pricing in popular apps.
- Others compare free vs. premium tiers and trial periods.
- Tips are shared for tracking spending and cancelling unwanted subscriptions.

Based on the information about the topic above, please create a short label of this topic. Make sure you to only return the label and nothing more.

[/INST] Managing Hidden Fees and Subscription Cost Creep
"""

# Main prompt (no keywords)
main_prompt = """
[INST]
I have a topic that contains the following documents:
[DOCUMENTS]

Create a single-sentence label (6–12 words), and return the label only.
[/INST]
"""


prompt = system_prompt + example_prompt + example_prompt_2 + main_prompt
# Create your representation model
representation_model = LangChain(chain, prompt=prompt)