import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Container size="form">
        <Card className="space-y-5 border-[rgba(63,148,149,0.16)] bg-white p-6 text-center shadow-level2 sm:p-8">
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-[rgba(63,148,149,0.2)] shadow-sm">
            <Image
              src="/images/devotional-path-empty.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          <div className="space-y-1.5">
            <p className="font-serif text-[13px] font-medium text-[#A9824D]">मार्गभ्रंशः • ४०४</p>
            <h2 className="text-[20px] font-bold tracking-tight text-[#193B3B]">
              Page Not Found
            </h2>
            <p className="mx-auto max-w-sm text-[13px] text-[#547070]">
              The page you are looking for does not exist or has moved.
            </p>
          </div>

          <div className="flex justify-center pt-1">
            <Link href="/">
              <Button
                variant="primary"
                leftIcon={<Home className="h-4 w-4" />}
                className="min-w-[160px]"
              >
                Return Home
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
