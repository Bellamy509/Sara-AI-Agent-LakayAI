import Canvas from "@/components/canvas";
import AuthGuard from "@/components/AuthGuard";
// import WorkingMemory  from "@/components/working-memory";
export default function Home() {
  return (
    <AuthGuard>
      <div>
        <Canvas />
      </div>
    </AuthGuard>
  );
}
