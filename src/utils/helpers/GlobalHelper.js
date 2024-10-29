export function isEmptyEntity(n) {
    return !(!!n
      ? typeof n === "object"
        ? Array.isArray(n)
          ? !!n.length
          : !!Object.keys(n).length
        : true
      : false);
  }
  

  export default function getLangID(langtype) {
    switch (langtype) {
      case "en":
        return 2;
      case "ar":
        return 1;
      default:
        return 1;
    }
  }