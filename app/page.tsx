"use client"
import Image from "next/image";
import axios from 'axios';
import { useState } from "react";


type ImageData = Array<[string, string]>;

export default function Home() {

  const [image, setImage] = useState<File | null>(null);
  const [image_data, setImageData] = useState<ImageData>([]);
  const [source_image, setSourceImage] = useState<[string, string]>(["", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: any) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setSourceImage(["", ""]);
      setImageData([]);
    } else {
      console.error("No file selected");
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    if (image === null) {
      console.error("No file selected");
      return;
    }
    formData.append("file", image);
    try {
      const response = await axios.post("http://localhost:8000/get_rec_up", formData);
      console.log(response.data);
      let flattenedArray = Object.entries(response.data) as ImageData;
      setSourceImage(flattenedArray[0]);
      flattenedArray.shift();
      setImageData(flattenedArray);
    } catch (error: any) {
      console.error('Error', error.message);
    }

    setImage(null);
    setIsLoading(false);
    let input = document.getElementById("file_input") as HTMLInputElement | null;
    if (input) {
      input.value = "";
    }

  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-10">
      {/* file selector, uploads it */}
      <form onSubmit={handleSubmit}>
        {/* <input type="file" id="file_input" onChange={handleImageChange} /> */}
        <input type="file" id="file_input" accept="image/*" onChange={handleImageChange} />
        {/* <button type="submit" className="">Submit</button> */}
        <button type="submit" className={`px-4 py-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} ${isLoading && 'cursor-not-allowed'}`} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* image preview */}
      {image && <Image src={URL.createObjectURL(image)} alt="image" width={300} height={300} />}

      {source_image[0] &&
        <div className="grid gap-10">
          <div className="place-self-center">
            <Image src={`data:image/jpeg;base64,${source_image[1]}`} alt={source_image[0]} width={300} height={300} />
            <h1 className="flex justify-center">Source Image</h1>
          </div>
          <div className="grid grid-cols-5 gap-5">
            {image_data.map((image, index) => (
              <div key={index}>
                {/* <img src={`data:image/jpeg;base64,${image[1]}`} alt={image[0]} /> */}
                <Image src={`data:image/jpeg;base64,${image[1]}`} alt={image[0]} width={300} height={300} />
              </div>
            ))}
            <h1 className="col-span-full flex justify-center">Recommended Images</h1>
          </div>
        </div>
      }
    </main>
  );
}
