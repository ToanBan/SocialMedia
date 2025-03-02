import Image from "next/image";

import Navigation from "./client_component/navigation";
import HomePost from "./client_component/homepost";
export default async function HomePage() {
  

  return (
    <>
      <div className="row">
        <Navigation />

        <HomePost/>

        <div className="col-2 scrollable-column" style={{ marginTop: "13rem" }}>
          <p className="text-dark fw-bolder fs-5 text-center">Contacts</p>

          <div className="d-flex gap-3 mt-4 justify-content-center align-items-center">
            <Image
              src={"/facebook.png"}
              alt="avt"
              height={20}
              width={20}
            ></Image>
            <p className="text-dark m-0">Dương Quá</p>
          </div>

          <div className="d-flex gap-3 mt-4 justify-content-center align-items-center">
            <Image
              src={"/facebook.png"}
              alt="avt"
              height={20}
              width={20}
            ></Image>
            <p className="text-dark m-0">Dương Quá</p>
          </div>

          <div className="d-flex gap-3 mt-4 justify-content-center align-items-center">
            <Image
              src={"/facebook.png"}
              alt="avt"
              height={20}
              width={20}
            ></Image>
            <p className="text-dark m-0">Dương Quá</p>
          </div>

          <div className="d-flex gap-3 mt-4 justify-content-center align-items-center">
            <Image
              src={"/facebook.png"}
              alt="avt"
              height={20}
              width={20}
            ></Image>
            <p className="text-dark m-0">Dương Quá</p>
          </div>
        </div>
      </div>
    </>
  );
}
