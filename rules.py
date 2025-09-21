from llama_cloud.types import ClassifierRule

rules = [
    ClassifierRule(
        type="Low Risk",
        description="This is a contract that outlines an affiliate agreement",
    ),
    ClassifierRule(
        type="Medium Risk",
        description="This is a contract that outlines a co-branding deal/agreement",
    ),
    ClassifierRule(
        type="High Risk",
        description="This is a contract that outlines a co-branding deal/agreement",
    ),
]