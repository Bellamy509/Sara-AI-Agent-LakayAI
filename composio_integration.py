from composio import ComposioToolSet, App

toolset = ComposioToolSet(api_key="kc41e2nmz2sypncf09l52c")

integration = toolset.get_integration(id="cb2747e6-c28e-441f-89f1-1d921e8b2114")
# Collect auth params from your users
print(integration.expectedInputFields)

connection_request = toolset.initiate_connection(
    integration_id=integration.id,
    entity_id="default",
)

# Redirect step require for OAuth Flow
print(connection_request.redirectUrl)
print(connection_request.connectedAccountId)
