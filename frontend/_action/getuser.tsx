import { redirect } from "next/navigation";

const GetUser = async () => {

    const res = await fetch("http://localhost:3001/getuser", {
        method: "GET",
        cache: "no-store",
        credentials:'include'
    });
    const data = await res.json();
    if(data.error){
        const responseRefreshToken = await fetch('http://localhost:3001/refreshtoken', {
            method: "GET",
            cache: "no-store",
            credentials:'include'
        })
        const DataResponseRefreshToken = await responseRefreshToken.json();
        if(DataResponseRefreshToken.token){
            const responseNewAccessToken = await fetch("http://localhost:3001/getuser", {
                method: "GET",
                cache: "no-store",
                credentials:'include'
            })

            const DataResponseNewAccessToken = await responseNewAccessToken.json();
            return DataResponseNewAccessToken;
            
        }
    }
    return data;
};

export default GetUser;
