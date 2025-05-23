"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ConnectionType, ServerConfig, MCP_STORAGE_KEY, MCPConfig } from "@/lib/mcp-config-types";
import { X, Plus, Server, Globe, Trash2, Mail, CheckSquare, MailCheck, RefreshCw, Copy, User, Search, FileText, ChevronDown, ChevronRight, Linkedin, Play } from "lucide-react";
import { ServerConfigsContext } from "@/providers/Providers";
import { generateMCPUrls, getUserIdentifiers } from "@/lib/user-id-generator";

// Custom hook to prevent hydration errors
function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

// External link icon component
const ExternalLink = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3 h-3 ml-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

interface MCPConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Config {
  endpoint: string;
  serverName: string;
}
export function MCPConfigModal({ isOpen, onClose }: MCPConfigModalProps) {
  // Use ref to avoid re-rendering issues
  const configsRef = useRef<Record<string, ServerConfig>>({});
  const hasMounted = useClientOnly();

  // Use localStorage hook for persistent storage
  const [savedConfigs, setSavedConfigs] = useLocalStorage<
    Record<string, ServerConfig>
  >(MCP_STORAGE_KEY, {});
  // console.log(savedConfigs, "savedConfigs");
  // Set the ref value once we have the saved configs
  useEffect(() => {
    if (Object.keys(savedConfigs).length > 0) {
      configsRef.current = savedConfigs;
    }
  }, [savedConfigs]);

  const con = useContext(ServerConfigsContext);
  const [configs, setConfigs] = useState<Config[]>(con?.config || []);
  const [mcpConfig, setMcpConfig] = useLocalStorage<any>("mcpConfig", []);
  const [serverName, setServerName] = useState("");
  const [connectionType, setConnectionType] = useState<ConnectionType>("sse");
  const [command, setCommand] = useState("");
  const [args, setArgs] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddServerForm, setShowAddServerForm] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [userIdentifiers, setUserIdentifiers] = useState(() => ({
    customerId: '6f8e24b1-b63f-4683-9b6e-27ce82dd1f8e',
    agentId: 'lakay-agent-default'
  }));

  // Set user identifiers only after component mounts (client-side)
  useEffect(() => {
    const identifiers = getUserIdentifiers();
    setUserIdentifiers(identifiers);
  }, []);

  // Calculate server statistics
  const totalServers = configs.length;
  const stdioServers = 0
  const sseServers = configs.length

  const { setMcpServers } = useCopilotChat();



  // Set loading to false when state is loaded
  useEffect(() => {
    setIsLoading(false);
    return () => {
      setMcpConfig(configs);
    }
  }, []);

  const addConfig = () => {
    if (!serverName) return;


    setConfigs([...configs, {
      endpoint: url,
      serverName: serverName,
    }]);
    con?.setConfig([...configs, {
      endpoint: url,
      serverName: serverName,
    }]);
    setMcpConfig([...configs, {
      endpoint: url,
      serverName: serverName,
    }]);
    setMcpServers([...configs, {
      endpoint: url,
      serverName: serverName,
    }]);

    // Reset form
    setServerName("");
    setCommand("");
    setArgs("");
    setUrl("");
    setShowAddServerForm(false);
  };

  const removeConfig = (index: number) => {
    setConfigs((prev) => { return prev.filter((_item, i) => i != index) });
    con?.setConfig(con?.config.filter((_item, i: number) => i != index));
    setMcpConfig(mcpConfig.filter((_item: Config[], i: number) => i != index));
  };

  // Helper function to add a new config
  const addNewConfig = (newConfig: Config) => {
    console.log('➕ Adding new config:', newConfig);
    
    const updatedConfigs = [...configs, newConfig];
    
    setConfigs(updatedConfigs);
    con?.setConfig(updatedConfigs);
    setMcpConfig(updatedConfigs);
    setMcpServers(updatedConfigs);
    
    console.log('✅ Configuration added successfully. Total configs:', updatedConfigs.length);
  };

  const addGmailConfig = () => {
    const { customerId, agentId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.gmail,
      serverName: "Gmail"
    };

    addNewConfig(newConfig);
  };

  const addTextToPdfConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.textToPdf,
      serverName: "Text to PDF"
    };

    addNewConfig(newConfig);
  };

  const addMemoryConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.memory,
      serverName: "Memory"
    };

    addNewConfig(newConfig);
  };

  const addMemoryOConfig = () => {
    const { customerId, agentId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.memoryO,
      serverName: "Memory O"
    };

    addNewConfig(newConfig);
  };

  const addOutlookConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.outlook,
      serverName: "Outlook"
    };

    addNewConfig(newConfig);
  };

  const addSharePointConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.sharePoint,
      serverName: "SharePoint"
    };

    addNewConfig(newConfig);
  };

  const addLinkedInConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.linkedin,
      serverName: "LinkedIn"
    };

    addNewConfig(newConfig);
  };

  const addYouTubeConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.youtube,
      serverName: "YouTube"
    };

    addNewConfig(newConfig);
  };

  const addTeamsConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.teams,
      serverName: "Microsoft Teams"
    };

    addNewConfig(newConfig);
  };

  const addGoogleTasksConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.googleTasks,
      serverName: "Google Tasks"
    };

    addNewConfig(newConfig);
  };

  const addSearchConfig = () => {
    const { customerId } = getUserIdentifiers();
    const urls = generateMCPUrls(customerId);
    
    const newConfig = {
      endpoint: urls.search,
      serverName: "Search"
    };

    addNewConfig(newConfig);
  };

  // Function to regenerate user identifiers
  const regenerateIdentifiers = () => {
    localStorage.removeItem('lakayAI_user_identifiers');
    const newIdentifiers = getUserIdentifiers();
    setUserIdentifiers(newIdentifiers);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Function to test MCP server connectivity
  const testConnection = async (endpoint: string, serverName: string) => {
    console.log(`🔍 Testing connection to ${serverName}: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'HEAD',
        mode: 'cors'
      });
      
      if (response.ok) {
        console.log(`✅ ${serverName} connection successful`);
        alert(`✅ Connexion à ${serverName} réussie !`);
      } else {
        console.error(`❌ ${serverName} connection failed with status:`, response.status);
        alert(`❌ Connexion à ${serverName} échouée (Status: ${response.status})`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ ${serverName} connection error:`, error);
      alert(`❌ Erreur de connexion à ${serverName}: ${errorMessage}`);
    }
  };

  // Function to regenerate Gmail configuration with new customerId
  const regenerateGmailConfig = () => {
    // Remove existing Gmail config if any
    const updatedConfigs = configs.filter(config => config.serverName !== 'Gmail');
    setConfigs(updatedConfigs);
    con?.setConfig(updatedConfigs);
    setMcpConfig(updatedConfigs);
    setMcpServers(updatedConfigs);
    
    // Generate new identifiers
    localStorage.removeItem('lakayAI_user_identifiers');
    const newIdentifiers = getUserIdentifiers();
    setUserIdentifiers(newIdentifiers);
    
    // Add new Gmail config with fresh identifiers
    setTimeout(() => {
      addGmailConfig();
    }, 100);
    
    console.log('🔄 Gmail configuration regenerated with new identifiers');
  };

  // Define Google Tasks available actions
  const googleTasksActions = [
    { name: "Clear Completed Tasks", description: "Nettoyer terminées" },
    { name: "Create Task List", description: "Créer liste" },
    { name: "Delete Task", description: "Suppr. tâche" },
    { name: "Delete Task List", description: "Suppr. liste" },
    { name: "Get Task", description: "Voir tâche" },
    { name: "Get Task List", description: "Voir liste" },
    { name: "Insert Task", description: "Ajouter tâche" },
    { name: "List Tasks", description: "Lister tâches" },
    { name: "List Task Lists", description: "Lister listes" },
    { name: "Patch Task", description: "Modifier tâche" },
    { name: "Patch Task List", description: "Modifier liste" }
  ];

  // Define Outlook available actions
  const outlookActions = [
    { name: "Download Outlook Attachment", description: "Télécharger pièce" },
    { name: "Create Outlook Calendar Event", description: "Créer événement" },
    { name: "Create Outlook Contact", description: "Créer contact" },
    { name: "Create Outlook Draft", description: "Créer brouillon" },
    { name: "Get Outlook Contact", description: "Voir contact" },
    { name: "Get Outlook Event", description: "Voir événement" },
    { name: "Get Outlook Profile", description: "Voir profil" },
    { name: "List Outlook Events", description: "Lister événements" },
    { name: "List Outlook Messages", description: "Lister messages" },
    { name: "Reply Outlook Email", description: "Répondre email" },
    { name: "Send Outlook Email", description: "Envoyer email" },
    { name: "Update Outlook Email", description: "Modifier email" }
  ];

  // Define Search available actions
  const searchActions = [
    { name: "duck_duck_go_search", description: "Recherche privée" },
    { name: "search", description: "Recherche Google" },
    { name: "tavily_search", description: "Recherche IA" },
    { name: "exa_similarlink", description: "Liens similaires" },
    { name: "news_search", description: "Actus" },
    { name: "scholar_search", description: "Articles académiques" },
    { name: "google_maps_search", description: "Lieux" },
    { name: "shopping_search", description: "Produits" },
    { name: "event_search", description: "Événements" },
    { name: "image_search", description: "Images" },
    { name: "finance_search", description: "Bourse" },
    { name: "trends_search", description: "Tendances" }
  ];

  // Define Gmail available actions
  const gmailActions = [
    { name: "send_email", description: "Envoyer email" },
    { name: "reply_to_thread", description: "Répondre" },
    { name: "fetch_emails", description: "Lire emails" },
    { name: "list_drafts", description: "Voir brouillons" },
    { name: "delete_draft", description: "Suppr. brouillon" },
    { name: "delete_message", description: "Suppr. email" },
    { name: "move_to_trash", description: "Mettre corbeille" },
    { name: "get_contacts", description: "Voir contacts" },
    { name: "search_people", description: "Chercher contacts" }
  ];

  // Define SharePoint available actions
  const sharePointActions = [
    { name: "sharepoint_create_folder", description: "Créer dossier" },
    { name: "sharepoint_create_list", description: "Créer liste" },
    { name: "sharepoint_create_list_item", description: "Ajouter item" },
    { name: "sharepoint_create_user", description: "Créer utilisateur" },
    { name: "sharepoint_find_user", description: "Trouver utilisateur" },
    { name: "sharepoint_remove_user", description: "Suppr. utilisateur" }
  ];

  // Define LinkedIn available actions
  const linkedinActions = [
    { name: "create_linked_in_post", description: "Créer post" },
    { name: "delete_linked_in_post", description: "Suppr. post" },
    { name: "get_company_info", description: "Infos entreprises" },
    { name: "get_my_info", description: "Mon profil" }
  ];

  // Define YouTube available actions
  const youtubeActions = [
    { name: "liste_caption_piste", description: "Lister sous-titres" },
    { name: "mise à jour_vignette", description: "Maj vignette" }
  ];

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
          <div className="p-4">Loading configuration...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Server className="h-6 w-6 mr-2 text-gray-700" />
              <h1 className="text-2xl font-semibold">Appstore Configuration</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelpModal(true)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                title="Aide et dépannage"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
            <p className="text-sm text-gray-600">
              Manage your app
            </p>
            <div className="space-y-2">
              {/* Main app buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={addGmailConfig}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-1 justify-center"
                >
                  <Mail className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  Gmail
                </button>
                <button
                  onClick={addOutlookConfig}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-1 justify-center"
                >
                  <MailCheck className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  Outlook
                </button>
                <button
                  onClick={addSharePointConfig}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1 justify-center"
                >
                  <FileText className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  SharePoint
                </button>
                <button
                  onClick={addLinkedInConfig}
                  className="px-3 py-1.5 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 flex items-center gap-1 justify-center"
                >
                  <Linkedin className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  LinkedIn
                </button>
              </div>
              
              {/* Second row buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={addGoogleTasksConfig}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-1 justify-center"
                >
                  <CheckSquare className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  Google Tasks
                </button>
                <button
                  onClick={addSearchConfig}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 flex items-center gap-1 justify-center"
                >
                  <Search className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  Search
                </button>
                <button
                  onClick={addYouTubeConfig}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 flex items-center gap-1 justify-center"
                >
                  <Play className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  YouTube
                </button>
              </div>
              
              {/* Special troubleshooting section */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Dépannage :</p>
                <button
                  onClick={regenerateGmailConfig}
                  className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 flex items-center gap-1 justify-center"
                >
                  <RefreshCw className="h-4 w-4" />
                  <Mail className="h-4 w-4" />
                  Régénérer Gmail
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Server Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-md p-4">
            <div className="text-sm text-gray-500">Total Apps</div>
            <div className="text-3xl font-bold">{totalServers}</div>
          </div>
          <div className="bg-white border rounded-md p-4">
            <div className="text-sm text-gray-500">User ID</div>
            <div className="text-sm font-mono truncate">
              {hasMounted ? userIdentifiers.customerId.substring(0, 8) + '...' : 'Loading...'}
            </div>
            <button
              onClick={() => setShowUserInfo(true)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <User className="w-3 h-3 mr-1" />
              View Details
            </button>
          </div>
          <div className="bg-white border rounded-md p-4">
            <div className="text-sm text-gray-500">Agent ID</div>
            <div className="text-sm font-mono truncate">
              {hasMounted ? userIdentifiers.agentId : 'Loading...'}
            </div>
            <button
              onClick={regenerateIdentifiers}
              className="mt-2 text-xs text-orange-600 hover:text-orange-800 flex items-center"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Server List */}
        <div className="bg-white border rounded-md p-6">
          <h2 className="text-lg font-semibold mb-4">App List</h2>

          {totalServers === 0 ? (
            <div className="text-gray-500 text-center py-10">
              No servers configured. Click &quot;Add Server&quot; to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {configs.map((config, index) => (
                <div
                  key={index}
                  className="border rounded-md overflow-hidden bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{config?.serverName}</h3>
                        </div>
                        <div className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-xs rounded mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          SSE
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => testConnection(config.endpoint, config.serverName)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Test connection"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeConfig(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove app"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p className="truncate" title={config.endpoint}>
                        Endpoint: {config.endpoint}
                      </p>
                    </div>
                    
                    {/* Gmail Actions - Always show with beautiful design */}
                    {config?.serverName === "Gmail" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-red-50 to-rose-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-red-700 mb-1 flex items-center">
                          <Mail className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-3 gap-0.5">
                          {gmailActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-red-600 px-1.5 py-0.5 rounded text-center border border-red-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-red-500 text-center">
                          {gmailActions.length} actions
                        </div>
                      </div>
                    )}

                    {/* Google Tasks Actions - Always show with beautiful design */}
                    {config?.serverName === "Google Tasks" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-emerald-700 mb-1 flex items-center">
                          <CheckSquare className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-3 gap-0.5">
                          {googleTasksActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-emerald-600 px-1.5 py-0.5 rounded text-center border border-emerald-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-emerald-500 text-center">
                          {googleTasksActions.length} actions
                        </div>
                      </div>
                    )}

                    {/* Outlook Actions - Always show with beautiful design */}
                    {config?.serverName === "Outlook" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-blue-700 mb-1 flex items-center">
                          <MailCheck className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-3 gap-0.5">
                          {outlookActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-blue-600 px-1.5 py-0.5 rounded text-center border border-blue-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-blue-500 text-center">
                          {outlookActions.length} actions
                        </div>
                      </div>
                    )}

                    {/* Search Actions - Always show with beautiful design */}
                    {config?.serverName === "Search" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-purple-50 to-violet-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-purple-700 mb-1 flex items-center">
                          <Search className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-3 gap-0.5">
                          {searchActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-purple-600 px-1.5 py-0.5 rounded text-center border border-purple-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-purple-500 text-center">
                          {searchActions.length} actions
                        </div>
                      </div>
                    )}

                    {/* SharePoint Actions - Always show with beautiful design */}
                    {config?.serverName === "SharePoint" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-indigo-50 to-blue-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-indigo-700 mb-1 flex items-center">
                          <FileText className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-3 gap-0.5">
                          {sharePointActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-indigo-600 px-1.5 py-0.5 rounded text-center border border-indigo-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-indigo-500 text-center">
                          {sharePointActions.length} actions
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Actions - Always show with beautiful design */}
                    {config?.serverName === "LinkedIn" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-cyan-700 mb-1 flex items-center">
                          <Linkedin className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-2 gap-0.5">
                          {linkedinActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-cyan-600 px-1.5 py-0.5 rounded text-center border border-cyan-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-cyan-500 text-center">
                          {linkedinActions.length} actions
                        </div>
                      </div>
                    )}

                    {/* YouTube Actions - Always show with beautiful design */}
                    {config?.serverName === "YouTube" && (
                      <div className="mt-2 pt-1 border-t border-gray-200 bg-gradient-to-br from-red-50 to-orange-50 -mx-4 px-2 pb-2">
                        <h4 className="text-xs font-medium text-red-700 mb-1 flex items-center">
                          <Play className="w-2.5 h-2.5 mr-1" />
                          Actions:
                        </h4>
                        <div className="grid grid-cols-2 gap-0.5">
                          {youtubeActions.map((action, actionIndex) => (
                            <div
                              key={actionIndex}
                              className="text-xs bg-white text-red-600 px-1.5 py-0.5 rounded text-center border border-red-100"
                            >
                              {action.description}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-xs text-red-500 text-center">
                          {youtubeActions.length} actions
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Info Modal */}
        {showUserInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  User Identifiers
                </h2>
                <button
                  onClick={() => setShowUserInfo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Customer ID
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hasMounted ? userIdentifiers.customerId : 'Loading...'}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50 font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(userIdentifiers.customerId)}
                      className="px-2 py-2 text-gray-600 hover:text-gray-800"
                      title="Copy to clipboard"
                      disabled={!hasMounted}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Agent ID
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hasMounted ? userIdentifiers.agentId : 'Loading...'}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50 font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(userIdentifiers.agentId)}
                      className="px-2 py-2 text-gray-600 hover:text-gray-800"
                      title="Copy to clipboard"
                      disabled={!hasMounted}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Ces identifiants sont générés automatiquement et uniques pour chaque utilisateur. 
                    Ils sont utilisés pour créer des URLs personnalisées pour vos serveurs MCP.
                  </p>
                </div>

                <div className="flex justify-between space-x-2 pt-2">
                  <button
                    onClick={regenerateIdentifiers}
                    className="px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50 text-sm font-medium flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate IDs
                  </button>
                  <button
                    onClick={() => setShowUserInfo(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium flex items-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Server Modal */}
        {showAddServerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Server
                </h2>
                <button
                  onClick={() => setShowAddServerForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Server Name
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="e.g., api-service, data-processor"
                  />
                </div>


                {connectionType === "stdio" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Command
                      </label>
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="e.g., python, node"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Arguments
                      </label>
                      <input
                        type="text"
                        value={args}
                        onChange={(e) => setArgs(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="e.g., path/to/script.py"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">SSE URL</label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="e.g., http://localhost:8000/events"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setShowAddServerForm(false)}
                    className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={addConfig}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Server
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Aide et Dépannage MCP
                </h2>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">🔧 Problèmes Gmail</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
                    <p className="mb-2"><strong>Si Gmail ne se connecte pas :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Cliquez sur "Régénérer Gmail" pour obtenir une nouvelle URL</li>
                      <li>Utilisez le bouton de test (🔍) pour vérifier la connexion</li>
                      <li>Vérifiez la console du navigateur (F12) pour les erreurs détaillées</li>
                      <li>L'URL originale peut avoir expiré - la régénération crée une nouvelle URL</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">📋 Étapes de diagnostic</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Ajoutez Gmail via le bouton rouge "Gmail"</li>
                      <li>Si cela échoue, cliquez sur "Régénérer Gmail"</li>
                      <li>Testez la connexion avec le bouton 🔍</li>
                      <li>Ouvrez la console (F12) pour voir les logs détaillés</li>
                      <li>Vérifiez que l'app apparaît dans la liste</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-green-600 mb-2">✅ Identifiants utilisateur</h3>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
                    <p className="mb-2">Vos identifiants actuels :</p>
                    <div className="font-mono text-xs bg-white p-2 rounded border">
                      <div><strong>Customer ID:</strong> {hasMounted ? userIdentifiers.customerId : 'Loading...'}</div>
                      <div><strong>Agent ID:</strong> {hasMounted ? userIdentifiers.agentId : 'Loading...'}</div>
                    </div>
                    <p className="mt-2 text-gray-600">Ces identifiants sont utilisés pour créer des URLs uniques pour vos serveurs MCP.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-600 mb-2">🔍 URL de test Gmail</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-md p-3 text-sm">
                    <p className="mb-2">URL Gmail actuelle :</p>
                    <div className="font-mono text-xs bg-white p-2 rounded border break-all">
                      https://mcp.composio.dev/partner/composio/gmail?customerId=6f8e24b1-b63f-4683-9b6e-27ce82dd1f8e&agent=lakayAI
                    </div>
                    <p className="mt-2 text-gray-600">✅ Cette URL fonctionne maintenant ! Elle utilise le même format que Google Tasks.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium flex items-center"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
