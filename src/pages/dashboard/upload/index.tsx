
export default function UploadPage() {

  return (
    <div>
      <h1>Upload Page</h1>
    </div>
  )
  // const [file, setFile] = useState<IVideoFile | null>(null);
  // const [progress, setProgress] = useState<number>(0);
  // const [title, setTitle] = useState<string>("");
  // const [description, setDescription] = useState<string>("");
  // const [error, setError] = useState<string | null>(null);
  // const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  // const [step, setStep] = useState<number>(1);
  // const [idToken, setIdToken] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // const { useUploadVideo, useCancelUpload, useDeleteVideo } = useUpload({
  //   onProgress: (percent) => {
  //     setProgress(percent);
  //     if (percent === 100) {
  //       setStatus("success");
  //       setIsLoading(false);
  //     }
  //   },
  // });

  // const { validateFile, validateMetadata } = useFileValidation();

  // // Load idToken from localStorage
  // useEffect(() => {
  //   const userAuth = localStorage.getItem("user_auth");
  //   if (userAuth) {
  //     const parsedUserAuth = JSON.parse(userAuth);
  //     console.log("Loaded idToken:", parsedUserAuth.tokens.idToken);
  //     setIdToken(parsedUserAuth.tokens.idToken);
  //   }
  // }, []);

  // const handleFileChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const selectedFile = e.target.files?.[0];
  //     console.log("Selected file:", selectedFile);

  //     if (!selectedFile) {
  //       setError("Please select a video file");
  //       setStatus("error");
  //       return;
  //     }

  //     const error = validateFile(selectedFile);
  //     if (error) {
  //       console.error(error);
  //       setError(error);
  //       setStatus("error");
  //       return;
  //     }

  //     console.log("File type check passed successfully");
  //     const videoFile: IVideoFile = Object.assign(selectedFile, {
  //       progress: 0,
  //       status: "idle" as const,
  //     });

  //     setFile(videoFile);
  //     setError(null);
  //     setStatus("idle");
  //   },
  //   [validateFile]
  // );

  // const handleNextStep = useCallback(() => {
  //   if (step === 1) {
  //     const error = validateFile(file);
  //     if (error) {
  //       setError(error);
  //       setStatus("error");
  //       return;
  //     }
  //   } else if (step === 2) {
  //     const error = validateMetadata(title, description);
  //     if (error) {
  //       setError(error);
  //       setStatus("error");
  //       return;
  //     }
  //   }
  //   setStep((prev) => prev + 1);
  //   setError(null);
  // }, [step, file, title, description, validateFile, validateMetadata]);

  // const handlePrevStep = useCallback(() => {
  //   setStep((prev) => prev - 1);
  //   setError(null);
  // }, []);

  // const handleUpload = useCallback(async () => {
  //   if (!file || !idToken) {
  //     setError("Please select a file and authenticate");
  //     setStatus("error");
  //     return;
  //   }

  //   const error = validateFile(file);
  //   if (error) {
  //     setError(error);
  //     setStatus("error");
  //     return;
  //   }

  //   try {
  //     setStatus("uploading");
  //     setIsLoading(true);
  //     console.log("Starting upload with idToken:", idToken);
  //     const { mutateAsync } = useUploadVideo;
  //     await mutateAsync({ file, idToken });
  //     console.log("Upload successful");
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : "Failed to upload video";
  //     console.error("Upload failed:", err);
  //     setError(errorMessage);
  //     setStatus("error");
  //     setIsLoading(false);
  //   }
  // }, [file, idToken, useUploadVideo, validateFile]);

  // const handleCancel = useCallback(async () => {
  //   if (!file || !idToken) return;

  //   try {
  //     setIsLoading(true);
  //     await useCancelUpload(file, idToken);
  //     setFile(null);
  //     setProgress(0);
  //     setStatus("idle");
  //     setStep(1);
  //     setError(null);
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : "Failed to cancel upload";
  //     console.error("Cancel failed:", err);
  //     setError(errorMessage);
  //     setStatus("error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [file, idToken, useCancelUpload]);

  // const handleDelete = useCallback(async () => {
  //   if (!file || !idToken || !file.s3Key) return;

  //   try {
  //     setIsLoading(true);
  //     await useDeleteVideo.mutateAsync({ key: file.s3Key, idToken });
  //     setFile(null);
  //     setProgress(0);
  //     setStatus("idle");
  //     setStep(1);
  //     setError(null);
  //     console.log("File deleted successfully");
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : "Failed to delete file";
  //     console.error("Delete failed:", err);
  //     setError(errorMessage);
  //     setStatus("error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [file, idToken, useDeleteVideo]);

  // // const handleRetry = useCallback(() => {
  // //   setError(null);
  // //   setStatus("idle");
  // //   setProgress(0);
  // //   handleUpload();
  // // }, [handleUpload]);

  // const authenticate = useCallback(() => {
  //   const token = "dummy-id-token"; // Thay bằng logic lấy token thực tế
  //   console.log("Authenticating with token:", token);
  //   setIdToken(token);
  // }, []);

  // const renderStepIndicator = () => (
  //   <div className="flex items-center justify-center mb-6 space-x-4">
  //     {["Select File", "Metadata", "Upload"].map((label, index) => (
  //       <div key={index} className="flex items-center">
  //         <div
  //           className={`w-8 h-8 rounded-full flex items-center justify-center ${step > index + 1
  //             ? "bg-green-500 text-white"
  //             : step === index + 1
  //               ? "bg-blue-500 text-white"
  //               : "bg-gray-300 text-gray-600"
  //             }`}
  //         >
  //           {index + 1}
  //         </div>
  //         <span className="ml-2 text-sm">{label}</span>
  //         {index < 2 && <div className="w-8 h-1 bg-gray-300 mx-2" />}
  //       </div>
  //     ))}
  //   </div>
  // );

  // return (
  //   <div className="max-w-2xl mx-auto p-4 sm:p-6">
  //     <Card className="shadow-lg">
  //       <CardHeader>
  //         <CardTitle className="text-xl sm:text-2xl">Upload Video</CardTitle>
  //       </CardHeader>
  //       <CardContent className="space-y-6">
  //         {renderStepIndicator()}

  //         {!idToken && (
  //           <div className="mb-6">
  //             <Button onClick={authenticate} className="w-full" disabled={isLoading}>
  //               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
  //               Authenticate
  //             </Button>
  //           </div>
  //         )}

  //         {idToken && (
  //           <>
  //             {step === 1 && (
  //               <div className="space-y-4">
  //                 <h3 className="text-lg font-semibold">Step 1: Select Video</h3>
  //                 <Input
  //                   type="file"
  //                   accept="video/mp4,video/mpeg,video/webm"
  //                   onChange={handleFileChange}
  //                   className="w-full"
  //                   disabled={isLoading}
  //                 />
  //                 {file && (
  //                   <div className="text-sm text-gray-600">
  //                     <p>Selected: {file.name}</p>
  //                     <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
  //                   </div>
  //                 )}
  //               </div>
  //             )}

  //             {step === 2 && (
  //               <div className="space-y-4">
  //                 <h3 className="text-lg font-semibold">Step 2: Video Metadata</h3>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
  //                   <Input
  //                     value={title}
  //                     onChange={(e) => setTitle(e.target.value)}
  //                     placeholder="Enter video title"
  //                     disabled={isLoading}
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
  //                   <Textarea
  //                     value={description}
  //                     onChange={(e) => setDescription(e.target.value)}
  //                     placeholder="Enter video description"
  //                     rows={4}
  //                     disabled={isLoading}
  //                   />
  //                 </div>
  //               </div>
  //             )}

  //             {step === 3 && (
  //               <div className="space-y-4">
  //                 <h3 className="text-lg font-semibold">Step 3: Upload Video</h3>
  //                 {(status === "uploading" || status === "success") && (
  //                   <div>
  //                     <p className="text-sm text-gray-600 mb-2">Progress: {progress.toFixed(1)}%</p>
  //                     <Progress
  //                       value={progress}
  //                       className="w-full h-2 transition-all duration-300 ease-in-out"
  //                     />
  //                   </div>
  //                 )}
  //                 {status === "success" && (
  //                   <Alert variant="default" className="bg-green-100 text-green-700">
  //                     <AlertTitle>Success</AlertTitle>
  //                     <AlertDescription>Video uploaded successfully!</AlertDescription>
  //                   </Alert>
  //                 )}
  //                 {status === "error" && (
  //                   <Alert variant="destructive" className="my-4">
  //                     <AlertTitle>Error</AlertTitle>
  //                     <AlertDescription>{error}</AlertDescription>
  //                   </Alert>
  //                 )}
  //               </div>
  //             )}

  //             {error && status !== "error" && (
  //               <Alert variant="destructive" className="my-4">
  //                 <AlertTitle>Error</AlertTitle>
  //                 <AlertDescription>{error}</AlertDescription>
  //               </Alert>
  //             )}

  //             <div className="flex justify-between mt-6 space-x-2">
  //               {step > 1 && (
  //                 <Button
  //                   variant="outline"
  //                   onClick={handlePrevStep}
  //                   disabled={status === "uploading" || isLoading}
  //                 >
  //                   <ArrowLeft className="mr-2 h-4 w-4" />
  //                   Previous
  //                 </Button>
  //               )}
  //               {step < 3 && (
  //                 <Button
  //                   onClick={handleNextStep}
  //                   disabled={status === "uploading" || isLoading}
  //                   className="flex-1"
  //                 >
  //                   <ArrowRight className="mr-2 h-4 w-4" />
  //                   Next
  //                 </Button>
  //               )}
  //               {step === 3 && (
  //                 <div className="flex space-x-2 w-full">
  //                   {status === "uploading" && (
  //                     <Button
  //                       variant="destructive"
  //                       onClick={handleCancel}
  //                       disabled={isLoading}
  //                       className="flex-1"
  //                     >
  //                       <X className="mr-2 h-4 w-4" />
  //                       Cancel
  //                     </Button>
  //                   )}
  //                   {status === "success" && (
  //                     <Button
  //                       variant="destructive"
  //                       onClick={handleDelete}
  //                       disabled={isLoading}
  //                       className="flex-1"
  //                     >
  //                       <Trash2 className="mr-2 h-4 w-4" />
  //                       Delete
  //                     </Button>
  //                   )}
  //                   {(status === "idle" || status === "error") && (
  //                     <Button
  //                       onClick={handleUpload}
  //                       disabled={!file || isLoading}
  //                       className="flex-1"
  //                     >
  //                       {isLoading ? (
  //                         <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
  //                       ) : (
  //                         <Upload className="mr-2 h-4 w-4" />
  //                       )}
  //                       {status === "error" ? "Retry" : "Upload"}
  //                     </Button>
  //                   )}
  //                 </div>
  //               )}
  //             </div>
  //           </>
  //         )}
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
}