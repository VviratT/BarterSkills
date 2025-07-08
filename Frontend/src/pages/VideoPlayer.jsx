import React from "react";
import { useParams } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();
  return <div>Video Player for video #{id} (WIP)</div>;
}
