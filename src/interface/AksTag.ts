import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useTags } from "@/layout/hooks/useTag";

const { multiTags } = useTags();
export const deleteTag = (path: string, query?: object, params?: object) => {
  const length = 1;
  //let valueIndex: number = -1;
  const startIndex: number = multiTags.value.findIndex((item: any) => {
    console.log(item.query);
    if (item.query) {
      if (item.path === path) {
        return JSON.stringify(item.query) === JSON.stringify(query);
      }
    } else if (item.params) {
      if (item.path === path) {
        return JSON.stringify(item.params) === JSON.stringify(params);
      }
    } else {
      return item.path === path;
    }
  });
  console.log("startIndex", startIndex);
  if (startIndex === -1) return;
  useMultiTagsStoreHook().handleTags("splice", "", { startIndex, length });
};
