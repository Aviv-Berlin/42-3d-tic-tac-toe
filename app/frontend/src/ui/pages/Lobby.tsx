import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 items-center w-full">
        <div className="relative flex w-full justify-center items-center">
          <button
            className="absolute left-0 border rounded-md border-stone-400 px-2 py-1 hover:bg-stone-200 cursor-pointer"
            onClick={() => navigate('/home')}
          >← Back</button>
          <h2 className="text-xl">Mode: <span className="font-serif italic">Online</span></h2>
        </div>
        <div className="w-full border">
        </div>
      </div>
    </MainLayout>
  );
};

export default Lobby;
