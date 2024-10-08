import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-20 p-6">
        <div className="my-6">
          <p className="text-gray-400 text-sm text-center">Trusted and loved by creators like </p>
          <div className="flex justify-between space-x-4 mt-6 font-medium text-2xl text-gray-500 max-w-4xl mx-auto">
            <p>MR BEAST</p>
            <p>POdIPE</p>
            <p>Think Media</p>
            <p>CNN+</p>
            <p>NatGEO Charity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <p className="text-4xl font-semibold">
            Explore Case studies of how creators have 10X their revenue using Aptopus
          </p>

          <div className="space-y-5">
            <p className="text-xs text-gray-400">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore enim dignissimos veniam temporibus.
              Molestias, aliquam? Fuga nisi eius rerum consectetur ex non perferendis architecto nihil iusto, dolore
              quibusdam, voluptatem natus nemo magni dignissimos dicta quasi ut reprehenderit deleniti. Veniam quos
              ullam corrupti ratione perspiciatis. Dolorum atque molestias facilis quia deserunt.
            </p>
            <Button className="rounded-full text-xs">Learn more</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Card className="bg-transparent text-gray-400 border-gray-800 border-none rounded-none">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <img src="/icons/instant.svg" className="h-16 w-16 p-2 rounded-sm" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-3 text-lg font-medium">Instant Settlements</p>
              <p className="text-gray-400 text-sm">
                Creators receive their payments instantly, directly to their wallets, eliminating any middlemen.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-transparent text-gray-400 border-gray-800 border-none rounded-none">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <img src="/icons/wallet.svg" className="h-16 w-16 p-2 rounded-sm" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-3 text-lg font-medium">No Percentage Fee</p>
              <p className="text-gray-400 text-sm">
                Keep 100% of your earnings—unlike platforms like YouTube that take up to 30% of superchats.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-transparent text-gray-400 border-gray-800 border-none rounded-none">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <img src="/icons/member.svg" className="h-16 w-16 p-2 rounded-sm" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-3 text-lg font-medium">Exclusive Memberships</p>
              <p className="text-gray-400 text-sm">
                Create tokens to reward your supporters, granting them access to exclusive content across platforms like
                Patreon and Substack.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
