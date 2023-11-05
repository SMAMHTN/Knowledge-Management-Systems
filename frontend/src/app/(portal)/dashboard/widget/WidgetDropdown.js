import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import the router
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function WidgetDropdown({ viewListLink }) {
  const router = useRouter(); // Initialize the router

  const handleViewListClick = () => {
    // Use router to navigate to the provided link
    router.push(viewListLink);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0  hover:border-gray-400 hover:border hover:rounded-md">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-300" />
        <DropdownMenuItem
          className="hover:underline hover:cursor-pointer"
          onClick={handleViewListClick} // Call the function on click
        >
          View detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WidgetDropdown;
