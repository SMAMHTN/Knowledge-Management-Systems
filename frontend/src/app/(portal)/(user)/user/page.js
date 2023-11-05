import DataTable from './DataTable';
import { Separator } from '@/components/SmComponent';

function listuser() {
  return (
    <div className="w-full">
      <div className="bg-white w-full rounded-md shadow px-4 py-2 mb-2">
        <h2 className="text-2xl font-semibold mb-1">List User</h2>
        <p className="text-xs mb-1">
          view and access list of user.
        </p>
        <Separator />
      </div>
      {/* <div className="flex flex-auto w-full md:w-4/5 lg:w-3/4" /> */}
      <DataTable />
    </div>
  );
}

export default listuser;
