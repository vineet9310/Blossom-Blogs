'use client';

import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type PostClientContentProps = {
  title: string;
};

export function PostClientContent({ title }: PostClientContentProps) {
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
        setPageUrl(window.location.href);
    }, []);

  if (!pageUrl) return null;

  return (
    <>
      <Separator className="my-12" />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <h3 className="text-xl font-headline font-semibold">Share this post</h3>
        <div className="flex items-center gap-4">
          <TwitterShareButton url={pageUrl} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <FacebookShareButton url={pageUrl} title={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <LinkedinShareButton url={pageUrl} title={title}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
        </div>
      </div>
      
      <Separator className="my-12" />

      <div>
        <h3 className="text-3xl font-headline font-semibold mb-8">Leave a Comment</h3>
        <form className="space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your Email" />
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" placeholder="Write your comment here..." rows={5} />
          </div>
          <Button type="submit">Post Comment</Button>
        </form>
      </div>
    </>
  );
}
