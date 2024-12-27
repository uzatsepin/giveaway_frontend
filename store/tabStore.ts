export const useTabStore = defineStore("tab", () => {
    const activeTab = ref('ACTIVE');

    const tabs = [
        { id: "ACTIVE", label: "Активні" },
        { id: "DRAFT", label: "Відкладені" }, 
        { id: "COMPLETED", label: "Завершені" },
        { id: "CANCELLED", label: "Скасовані" }
      ]

    function setActiveTab(tabId: string) {
        activeTab.value = tabId;
    }

    return {
        activeTab,
        tabs,
        setActiveTab
    }
})