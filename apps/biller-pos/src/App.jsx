import { Button } from "@restor/ui";

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="mt-2 text-gray-400">
        Testing the shared UI component library.
      </p>

      <div className="mt-6">
        <Button>Click Me!</Button>
      </div>
    </div>
  );
}

export default App;
