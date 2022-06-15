export type TabItem = {
  name: string;
  visible: boolean;
  groups: Array<string>;
};
function useFallbackItems(): Array<TabItem> {
  const fallbackTabs = [
    {
      name: 'home',
      visible: true,
      groups: ['default'],
    },
    {
      name: 'Teaching',
      visible: true,
      groups: ['default'],
    },
    {
      name: 'Featured',
      visible: true,
      groups: ['default'],
    },
    {
      name: 'More',
      visible: true,
      groups: ['default'],
    },
  ];

  const filteredItems = fallbackTabs;
  return filteredItems;
}
export default useFallbackItems;
