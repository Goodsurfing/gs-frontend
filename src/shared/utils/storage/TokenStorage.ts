import Storage from "./Storage";

class TokenStorage extends Storage<"token"> {
    public getToken() {
        return this.get("token");
    }

    public setToken(token: string) {
        return this.set("token", token);
    }
}

const tokenStorage = new TokenStorage();
export default tokenStorage;
