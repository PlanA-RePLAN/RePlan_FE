import { useNavigate } from "react-router-dom"
import BackHeader from "@/shared/components/BackHeader"
import Title from "@/shared/components/Title";
import DefaultProfileIcon from "@/icons/DefaultProfileIcon";
import ProfileInput from "./components/ProfileInput";
import MainButton from "@/shared/components/MainButton";

export default function ProfileSetup() {

  const navigate = useNavigate();
  const moveBack = () =>{
    navigate("/")
  }
  return (
    <div>
      <BackHeader title="프로필 입력" onBack={moveBack} />
      <div className="w-full px-5 flex flex-col justify-center items-center">
        <div className="flex flex-col w-full mt-8">
          <Title children="안녕하세요," />
          <Title children="프로필을 입력해주세요!" />
        </div>
        <div className="flex justify-center relative w-30 mt-10">
          <DefaultProfileIcon/>
          <div className="w-7 h-7 bg-white border border-bluegray-light-hover flex justify-center items-center rounded-full absolute bottom-0 right-0">
            <img src="/src/assets/camera.svg" alt="" />
          </div>
        </div>
        <div className="w-full mt-10 relative">
          <ProfileInput />
        </div>
        <MainButton 
          title={"다음으로"} 
          option={"primary"} 
          onClick={()=>{}}
          className="mt-10"
         />
      </div>
    </div>
  )
}