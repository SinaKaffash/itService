"use client";
import { useState } from "react";
import { updateTicketAction } from "@/actions/ticket.actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
export function TicketAdminMutations({ id, status, notes }: { id: string; status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"; notes: string }) { const [value, setValue] = useState(status); const [internalNotes, setNotes] = useState(notes); return <div className="flex flex-wrap items-center gap-2"><Select onValueChange={value => setValue(value as typeof status)} value={value}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NEW">جدید</SelectItem><SelectItem value="IN_PROGRESS">در حال بررسی</SelectItem><SelectItem value="RESOLVED">حل شده</SelectItem><SelectItem value="CLOSED">بسته</SelectItem></SelectContent></Select><Textarea className="min-h-10 w-52" onChange={event => setNotes(event.target.value)} placeholder="یادداشت داخلی" value={internalNotes} /><Button onClick={() => updateTicketAction({ id, status: value, internalNotes })} size="sm" type="button">ذخیره</Button></div>; }
