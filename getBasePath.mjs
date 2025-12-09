export function getBasePath() {
  let base = "/";
  if(process.env.NODE_ENV === "production") {
    if(!process.env.DEPLOY_YEAR) {
      throw new Error("You must specify a DEPLOY_YEAR environment variable");
    }
    base = `/year/${process.env.DEPLOY_YEAR}`;
    console.log("BASE",base)
  }
  return base
}