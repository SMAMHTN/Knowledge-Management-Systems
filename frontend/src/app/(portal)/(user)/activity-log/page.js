import DataTable from './DataTable';
import { Separator } from '@/components/SmComponent';

function listhistory() {
  return (
    <div className="w-full">
      <div className="bg-white w-full rounded-md shadow px-4 py-2 mb-2">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-semibold mb-1">Activity Log</h2>
          <p className="text-xs mb-1">
            view and access list of History.
          </p>
          <Separator />
        </div>
      </div>
      <DataTable />
    </div>
  );
}

export default listhistory;
