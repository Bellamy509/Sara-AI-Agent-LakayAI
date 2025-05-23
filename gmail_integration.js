import { OpenAIToolSet } from 'composio-core';

const toolset = new OpenAIToolSet({ apiKey: 'kc41e2nmz2sypncf09l52c' });

async function setupGmailIntegration(userId = null) {
    try {
        console.log("🚀 Initialisation de l'intégration Gmail...\n");
        
        // Générer un entityId unique pour chaque utilisateur
        const uniqueEntityId = userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("🔐 ID d'entité unique généré:", uniqueEntityId);
        
        // Récupérer l'intégration Gmail
        const integration = await toolset.integrations.get({
            integrationId: '8e4c95c0-a09a-4b68-8bd5-9032aa8b23f4'
        });
        
        console.log("✅ Intégration Gmail trouvée:", integration.name);
        
        // Récupérer les paramètres requis pour l'authentification
        const expectedInputFields = await toolset.integrations.getRequiredParams(integration.id);
        
        console.log("📋 Champs requis pour l'authentification:");
        console.log(expectedInputFields);
        
        // Initier la connexion du compte avec un entityId unique
        const connectedAccount = await toolset.connectedAccounts.initiate({
            integrationId: integration.id,
            entityId: uniqueEntityId,
        });
        
        console.log("\n📊 Résultat de la connexion:");
        console.log("- Statut de connexion:", connectedAccount.connectionStatus);
        console.log("- ID du compte connecté:", connectedAccount.connectedAccountId);
        
        if (connectedAccount.redirectUrl) {
            console.log("\n🔗 URL de redirection pour l'authentification:");
            console.log(connectedAccount.redirectUrl);
            console.log("\n📝 Instructions:");
            console.log("1. Copiez l'URL ci-dessus");
            console.log("2. Ouvrez-la dans votre navigateur");
            console.log("3. Connectez-vous avec votre compte Gmail");
            console.log("4. Autorisez l'accès à Gmail");
            console.log("5. Revenez ici une fois l'autorisation accordée");
        } else {
            console.log("✅ Connexion déjà établie ou aucune redirection nécessaire");
        }
        
        return {
            integration,
            expectedInputFields,
            connectedAccount
        };
        
    } catch (error) {
        console.error("❌ Erreur lors de la configuration Gmail:", error);
        console.log("\n🔧 Solutions possibles:");
        console.log("1. Vérifiez votre clé API Composio");
        console.log("2. Assurez-vous que l'intégration Gmail est activée");
        console.log("3. Vérifiez les permissions de votre compte Composio");
        console.log("4. Contactez le support Composio si le problème persiste");
        
        return null;
    }
}

// Fonction pour tester l'accès Gmail après authentification
async function testGmailAccess() {
    try {
        console.log("🧪 Test d'accès Gmail...\n");
        
        const tools = await toolset.getTools({
            actions: ["GMAIL_SEND_EMAIL", "GMAIL_LIST_EMAILS", "GMAIL_READ_EMAIL"]
        });
        
        console.log("✅ Outils Gmail récupérés avec succès");
        console.log(`📊 Nombre d'actions disponibles: ${tools.length}`);
        
        console.log("\n📧 Actions Gmail disponibles:");
        tools.forEach((tool, index) => {
            console.log(`${index + 1}. ${tool.name || 'Action Gmail'}`);
        });
        
        return true;
        
    } catch (error) {
        console.error("❌ Erreur lors du test d'accès Gmail:", error);
        console.log("\n💡 Suggestions:");
        console.log("1. Assurez-vous d'avoir complété l'authentification OAuth");
        console.log("2. Vérifiez que votre compte Google a accès à Gmail");
        console.log("3. Attendez quelques minutes et réessayez");
        
        return false;
    }
}

// Fonction pour lister les emails
async function listEmails(maxResults = 10) {
    try {
        console.log(`📬 Récupération des ${maxResults} derniers emails...`);
        
        const tools = await toolset.getTools({
            actions: ["GMAIL_LIST_EMAILS"]
        });
        
        // Note: Pour utiliser complètement cette fonction, vous auriez besoin d'OpenAI
        console.log("⚠️ Pour lister les emails, utilisez cette fonction avec OpenAI");
        console.log("Exemple d'utilisation avec OpenAI dans un autre script");
        
        return tools;
        
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des emails:", error);
        return null;
    }
}

// Exécution du script
console.log("📧 Démarrage de la configuration Gmail...\n");

setupGmailIntegration().then(result => {
    if (result) {
        console.log("\n✅ Configuration Gmail terminée avec succès");
        
        if (result.connectedAccount.redirectUrl) {
            console.log("\n🎯 Action requise: Authentification OAuth nécessaire");
            console.log("Suivez l'URL fournie ci-dessus pour vous authentifier");
        } else {
            console.log("\n🎯 Prochaine étape: Test d'accès Gmail");
            testGmailAccess();
        }
    } else {
        console.log("\n❌ Configuration Gmail échouée");
        console.log("Vérifiez les erreurs ci-dessus et réessayez");
    }
});

// Export des fonctions pour utilisation dans d'autres modules
export { 
    setupGmailIntegration, 
    testGmailAccess, 
    listEmails 
};
