'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MOCK_APPROVALS } from '@/lib/data';
import { CheckCircle, XCircle } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ApproverDashboard() {
    const { toast } = useToast();
    const [approvals, setApprovals] = useState(MOCK_APPROVALS);

    const handleApproval = (id: string, approved: boolean) => {
        const item = approvals.find(a => a.id === id);
        if (!item) return;

        toast({
            title: approved ? 'Request Approved' : 'Request Denied',
            description: `You have ${approved ? 'approved' : 'denied'} the request for "${item.item}".`,
        });
        setApprovals(approvals.filter(a => a.id !== id));
    };


  return (
     <div className="grid gap-6">
        <DashboardSummary />
        <Card>
        <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review and respond to the following requests.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {approvals.map((approval) => (
                <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.eventName}</TableCell>
                    <TableCell>{approval.item}</TableCell>
                    <TableCell>{approval.submittedBy}</TableCell>
                    <TableCell className="text-right">${approval.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApproval(approval.id, true)}>
                        <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleApproval(approval.id, false)}>
                        <XCircle className="h-5 w-5" />
                        </Button>
                    </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
  );
}
