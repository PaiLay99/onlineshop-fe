"use client";
import React, { useState } from "react";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/data/mock-data";

interface DetailProps {
  detail: Product;
}

const BoyClothesDetail: React.FC<DetailProps> = ({ detail }) => {
  const router = useRouter();
  const { productName, price, description, imageUrl, size } = detail as Product;

  const [selectedSize, setSelectedSize] = useState<string>(size[0]);
  const [quantity, setQuantity] = useState<number>(1);

  if (!productName || !price || !description || !imageUrl || !size) {
    return <Text>Loading...</Text>; // Handle loading state or error gracefully
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setQuantity(value);
  };

  const handleCalculateTotal = () => {
    const totalPrice = price * quantity;
    return totalPrice.toFixed(2);
  };

  const handleAddToCart = async () => {
    const cartItem = {
      productName,
      price,
      description,
      imageUrl,
      selectedSize,
      quantity,
      totalPrice: handleCalculateTotal(),
    };

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    });

    if (response.ok) {
      // Optionally, redirect to the cart page or show a success message
      router.push("/cart");
    } else {
      console.error("Failed to add item to cart");
    }
  };

  return (
    <Box className="p-4">
      <Box className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-2">
        <Box className="relative w-40 h-40 mb-4 overflow-hidden rounded-full">
          <Image
            src={imageUrl}
            alt={productName}
            width={400}
            height={400}
            className="rounded-lg"
          />
        </Box>
        <Box>
          <Text className="text-2xl font-bold mb-2">{productName}</Text>
        </Box>
        <Box>
          <Text className="text-gray-800 mb-4 ">
            Price : ${price.toFixed(2)}
          </Text>
        </Box>
        <Box>
          <Text className="text-gray-700 mb-4">{description}</Text>
        </Box>
        <Grid>
          <Box className="flex items-center mb-4">
            <Text className="mr-2 w-[150px]">Choose Size:</Text>
            <Select onValueChange={setSelectedSize}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Size</SelectLabel>
                  {size.map((item, key) => (
                    <SelectItem value={item} key={key}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Box>

          <Box className="flex items-center mb-4">
            <Text className="mr-2 w-[150px]">Choose Quantity:</Text>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none"
            />
          </Box>
          <Flex align="center">
            <Box className="w-[160px]">
              <Text className="text-gray-800 mb-4">Total Price:</Text>
            </Box>
            <Box>
              <Text className="text-gray-800 mb-4 ">
                ${handleCalculateTotal()}
              </Text>
            </Box>
          </Flex>
        </Grid>
        <Flex className="space-x-2 pt-6">
          <Link href="/boy-clothes">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default BoyClothesDetail;