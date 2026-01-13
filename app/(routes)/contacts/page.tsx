"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EditIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const Page: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: contacts,
    isLoading,
    isError,
  } = useQuery<Contact[], Error>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get<Contact[]>(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-all-contact`);
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/delete-contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        {/* Header + Add Contact */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button asChild variant="default" size="sm">
            <Link href="/" className="flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Contact
            </Link>
          </Button>
        </div>

        {isLoading && <p>Loading contacts...</p>}
        {isError && <p className="text-red-500">Error fetching contacts</p>}

        {!isLoading && !isError && contacts && (
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contacts/edit/${contact.id}`} className="flex items-center">
                            <EditIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Contact</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(contact.id)} disabled={deleteMutation.isPending}>
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Contact</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Page;
