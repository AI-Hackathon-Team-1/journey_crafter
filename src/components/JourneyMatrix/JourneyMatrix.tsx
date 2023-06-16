import React from "react";
import { Text, VStack, HStack, Flex, Center, Box } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import "./index.css";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface JourneyData {
  title?: string;
  stages: JourneySection[];
}

interface JourneySection {
  title: string;
  entries: JourneyEntry[];
}

interface JourneyEntry {
  action: string;
  touchpoint: string;
  emotion: string;
}

const journeyData: JourneyData = {
  stages: [
    {
      title: "进入商店",
      entries: [
        { action: "查看商品列表", touchpoint: "新用户", emotion: "好奇" },
        { action: "点击商品", touchpoint: "新用户", emotion: "满意" },
      ],
    },
    {
      title: "选择商品",
      entries: [
        { action: "浏览商品详情", touchpoint: "新用户", emotion: "好奇" },
        { action: "加入购物车", touchpoint: "新用户", emotion: "满意" },
      ],
    },
    {
      title: "结账",
      entries: [
        { action: "填写收货地址", touchpoint: "新用户", emotion: "紧张" },
        { action: "支付订单", touchpoint: "新用户", emotion: "满意" },
      ],
    },
  ],
};

const canvasWidth = `${6 * 165}px`;

const data = {
  labels: ["", "", "", "", "", ""],
  datasets: [
    {
      label: "",
      data: [1, 3, 2, 4, 2, 3],
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      tension: 0.1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  elements: {
    line: {
      backgroundColor: "transparent",
      borderWidth: 2,
    },
    point: {
      radius: 0,
    },
  },
};

const JourneyMatrix = () => {
  return (
    <VStack display="flex" alignItems="flex-start">
      <HStack alignItems="flex-start">
        <VStack w="150px">
          <Flex
            w="100%"
            h="30px"
            marginBottom="5px"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Text fontSize="xl" fontWeight="bold" mb="2px" textAlign="right">
              {"Stages"}
            </Text>
          </Flex>
          <Flex
            w="100%"
            h="70px"
            marginY="6px"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Text fontSize="xl" fontWeight="bold" mb="2px" textAlign="right">
              {"Tasks"}
            </Text>
          </Flex>
          <Flex
            w="100%"
            h="70px"
            marginY="6px"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Text fontSize="xl" fontWeight="bold" mb="2px" textAlign="right">
              {"Emotions"}
            </Text>
          </Flex>
        </VStack>
        {journeyData.stages.map((section, sectionIndex) => (
          <VStack key={sectionIndex} minW="160px">
            <Flex w="100%" color="white">
              <Center w="100%" bg="green.500" borderRadius="5px">
                <Text fontSize="xl" fontWeight="bold" mb="2px" marginY="auto">
                  {section.title}
                </Text>
              </Center>
            </Flex>
            <HStack>
              {section.entries.map((entry, entryIndex) => (
                <VStack p="5px" key={entryIndex}>
                  <Flex
                    w="100%"
                    borderWidth="1px"
                    borderRadius="5px"
                    borderColor="gray.300"
                    minW="150px"
                    minH="70px"
                  >
                    <Box w="100%" minH="70px" m="5px" borderRadius="5px">
                      <Text>{entry.action}</Text>
                    </Box>
                  </Flex>
                  <Flex
                    w="100%"
                    borderWidth="1px"
                    borderRadius="5px"
                    borderColor="gray.300"
                    minW="120px"
                    minH="70px"
                  >
                    <Box w="100%" minH="70px" m="5px" borderRadius="5px">
                      <Text>{entry.touchpoint}</Text>
                    </Box>
                  </Flex>
                  {/*<Box w="100%" h="104px">*/}
                  {/*  <Text>{entry.emotion}</Text>*/}
                  {/*</Box>*/}
                </VStack>
              ))}
            </HStack>
          </VStack>
        ))}
      </HStack>
      <HStack
        w="100%"
        h="140px"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Flex w="150px" marginY="5px" justifyContent="flex-end">
          <Text fontSize="xl" fontWeight="bold" mb="2px" textAlign="right">
            {"Touch Points"}
          </Text>
        </Flex>
        <Box
          w={canvasWidth}
          h="100%"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p="4"
          marginLeft="5px"
        >
          <Line
            data={data}
            options={options}
            width={canvasWidth}
            style={{ margin: "0 30px" }}
          />
        </Box>
      </HStack>
    </VStack>
  );
};

export default JourneyMatrix;
