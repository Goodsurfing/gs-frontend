// import { IUserInfo } from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.interface";
// import { userInfoApi } from "@/store/api/userInfoApi";
// import { convertFileToBinary } from "@/utils/files/convertFileToBinary";
// import { useState } from "react";
// import { useUploadFile } from "../files/useUploadFile";

// export const useUpdateUserInfo = async (
//     data: IUserInfo,
//     userInfo: IUserInfo
// ) => {
//     const [updateUserInfo] = userInfoApi.usePutUserInfoMutation();
//     const binaryImage = convertFileToBinary(data.image);
//     let imageUuid: string;
//     try {
//         const handleUpdate = () => {
//             if (!data) return;

//             const { image, ...otherData } = data;

//             if (!image) {
//                 otherData.imageUuid = userInfo?.image.id;
//                 return updateUserInfo(otherData);
//             }

//             useUploadFile(image.name, binaryImage)
//                 .then(id => {
//                     setImageUuid(id);
//                     otherData.imageUuid = id;
//                     return updateUserInfo(otherData);
//                 })
//                 .catch(error => {
//                     console.error(error);
//                 });

//         return { handleUpdate };
//     } catch (error) {
//         console.error(error);
//     }
// };
