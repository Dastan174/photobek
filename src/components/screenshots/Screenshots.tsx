import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface IPhoto {
  url: string;
}

const Screenshots = () => {
  const webcameraRef = useRef<null | Webcam>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [pictures, setPictures] = useState([]);

  const getScreenshot = () => {
    const imageURL = webcameraRef.current?.getScreenshot();
    setImageURL(imageURL!);
  };

  const sendPicture = async () => {
    if (!imageURL) {
      console.log("Take a picture");
      return;
    }
    try {
      const blob = await fetch(imageURL).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "photo.jpg");

      const response = await axios.post(
        "https://ca55f2065aa90131.mokky.dev/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.post(
        "https://api-crud.elcho.dev/api/v1/64913-c8800-c01fa/fs-16-pictures",
        response.data
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getPicturesFromApi = async () => {
    const { data } = await axios.get(
      "https://api-crud.elcho.dev/api/v1/64913-c8800-c01fa/fs-16-pictures"
    );
    setPictures(data.data);
  };
  useEffect(() => {
    getPicturesFromApi();
  }, [pictures]);
  return (
    <div>
      <div className="cam">
        <Webcam ref={webcameraRef} />
        <button onClick={getScreenshot}>Shot</button>
        <button onClick={sendPicture}>Send Picture</button>
        <img src={imageURL} alt="" />
      </div>
      <div className="list">
        {pictures?.map((item: IPhoto) => (
          <img src={item.url} alt="" />
        ))}
      </div>
    </div>
  );
};

export default Screenshots;
