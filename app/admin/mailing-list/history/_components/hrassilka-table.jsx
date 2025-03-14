"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";

export function HRassikaTable({ hrassikas }) {
  const [selectedHRassika, setSelectedHRassika] = useState(null);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Заголовок</TableHead>
            <TableHead>Текст</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Дата обновления</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hrassikas.map((hrassika) => (
            <Dialog key={hrassika.id}>
              <DialogTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedHRassika(hrassika)}
                >
                  <TableCell>{hrassika.id}</TableCell>
                  <TableCell>{hrassika.title}</TableCell>
                  <TableCell className="truncate max-w-xs">{hrassika.body}</TableCell>
                  <TableCell>
                    {format(new Date(hrassika.created_at), "PPP")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(hrassika.updated_at), "PPP")}
                  </TableCell>
                </TableRow>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogDescription>ID: {selectedHRassika?.id}</DialogDescription>
                  <DialogTitle>{selectedHRassika?.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Текст</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedHRassika?.body}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Дата создания</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedHRassika?.created_at &&
                        format(
                          new Date(selectedHRassika.created_at),
                          "PPP 'в' p"
                        )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Дата обновления</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedHRassika?.updated_at &&
                        format(
                          new Date(selectedHRassika.updated_at),
                          "PPP 'в' p"
                        )}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}