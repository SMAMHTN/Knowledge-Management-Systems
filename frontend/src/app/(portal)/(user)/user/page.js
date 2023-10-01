import DataTable from './DataTable';
import { Separator } from '@/components/SmComponent';

function listuser() {
  return (
    <div className="w-full">
      <div className="flex flex-auto w-full md:w-4/5 lg:w-3/4">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-semibold mb-1">List User</h2>
          <p className="text-xs mb-4">
            view and access list of user.
          </p>
          <Separator />
        </div>
      </div>
      <DataTable />
    </div>
  );
}

export default listuser;
