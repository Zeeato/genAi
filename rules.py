from llama_cloud.types import ClassifierRule

rules = [
    ClassifierRule(
        type="Low Risk",
        description="This is a contract that outlines a standard affiliate agreement.",
    ),
    ClassifierRule(
        type="Medium Risk",
        description="This is a contract that outlines a co-branding or partnership agreement with mutual obligations.",
    ),
    ClassifierRule(
        type="High Risk",
        description="This is a contract containing clauses for uncapped liability, broad indemnification, or the transfer of core intellectual property.",
    ),
]