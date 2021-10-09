import React from 'react'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react'

function QuillEditor({ value, onChange, style }: { value?: string; onChange?: (v: string) => void; style?: any }) {
    return (
        <Editor
            value={value}
            apiKey="u43oin7bl36qsa3yj6w1vkp13kjfglxgyfux5glktrt398qb"
            init={{
                language: 'zh_CN',
                height: 500,
                menubar: false,
                plugins: ['image code', 'advlist autolink lists link image', 'charmap print preview anchor help', 'searchreplace visualblocks code', 'insertdatetime media table paste wordcount'],
                toolbar: 'undo redo | formatselect | bold italic |  alignleft aligncenter alignright | bullist numlist outdent indent | image code',
                images_upload_handler: async (blobInfo, success, failure) => {
                    console.log('blobInfo', blobInfo)
                    const file = blobInfo.blob()
                    let formData = new FormData()
                    const fileName = blobInfo.name()
                    formData.append('file', file, blobInfo.filename() + '.png')
                    console.log('debug', formData, fileName)
                    const res: any = await axios.post('/api/upload', formData)
                    const result = res.data
                    if (result.code === 0) {
                        success(result.data.FileUrl)
                    }
                },
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
            onBlur={(e) => {
                onChange && onChange(e.target.getContent())
            }}
        />
    )
}
export default QuillEditor
