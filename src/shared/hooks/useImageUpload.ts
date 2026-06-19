import { useState, useRef } from 'react'
import { getPresignedUrl, uploadToS3 } from '@/shared/api/auth'
import { getProfileImagePresignedUrl } from '@/shared/api/user'

type UploadType = 'new' | 'existing'

export function useImageUpload(type: UploadType) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const uploadImage = async (token: string): Promise<string | null> => {
    if (!imageFile) 
      return null
    setIsUploading(true)
    try {
      const presignedRes = type === 'new'
        ? await getPresignedUrl(token, imageFile.name, imageFile.type)
        : await getProfileImagePresignedUrl(token, imageFile.name, imageFile.type)
      if (!presignedRes.success || !presignedRes.data) 
        return null
      await uploadToS3(presignedRes.data.presignedUrl, imageFile)
      return presignedRes.data.s3Key
    } catch {
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    imageFile,
    previewUrl,
    isUploading,
    fileInputRef,
    handleImageChange,
    uploadImage,
  }
}
