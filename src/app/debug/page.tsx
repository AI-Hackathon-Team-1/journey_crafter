"use client";

import {
  Box,
  VStack,
  Text,
  Flex,
  Center,
  Heading,
  Input,
  Button,
  Textarea,
  InputGroup,
  InputRightElement,
  useToast,
  useColorModeValue,
  Container,
  Icon,
} from "@chakra-ui/react";
import { FiSun } from "react-icons/fi";
import { BiMapAlt } from "react-icons/bi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage, IChatMessage } from "@/types/chat";
import MermaidWrapper from "@/components/MermairdWrapper";
import mermaid from "mermaid";
import { debounced } from "@/lib/debounce";
import Navbar from "@/components/Navbar";
import { JourneyHeaderWidget } from "@/components/JourneyMatrix/JourneyHeader";
import JourneyMatrix from "@/components/JourneyMatrix/JourneyMatrix";
import { Journey, JourneyFileParser } from "@/lib/JourneyFileParser";

const initPrompt1 = `我会给你一个需求，你要分析用户旅程中的stage和task，并按照下面的代码格式返回给我：
  personal:
    name: test
    age: 18
    isSingle: false
    role: dev
    address: wuhan
  scenario: simple_scenario
  goals: simple_goals
stages:
  - stage: stage1
    tasks:
      - task: task1
        touchpoint: touchpoint1
        emotion: emotion1
  - stage: stage2
    tasks:
      - task: task2
        touchpoint: touchpoint2
        emotions: emotion2
      - task: task3
        touchpoint: touchpoint3
        emotions: emotion3
`;

const initPrompt2 = "记住，只返回代码";

export default function ChatPage() {
  const [prompt1, setPrompt1] = useState(initPrompt1);
  const [prompt2, setPrompt2] = useState(initPrompt2);
  const [userInput, setUserInput] = useState("");

  const [journeyData, setJourneyData] = useState<Journey>({
    header: {
      personal: {
        name: "Tom",
        role: "UX Designer",
        isSingle: true,
        age: 32,
        address: "Palo Alto, California",
      },
      scenario:
        "The quick brown fox jumps over the lazy dog is an English language pangram a" +
        " sentence that contains all of the letters of the English alphabet. Owing to" +
        " its existence, Chakra was created.",
      goals:
        "The quick brown fox jumps over the lazy dog is an English language pangram a" +
        " sentence that contains all of the letters of the English alphabet. Owing to" +
        " its existence, Chakra was created.",
    },
    stages: [
      {
        stage: "进入商店",
        tasks: [
          { task: "查看商品列表", touchpoint: "新用户", emotion: "好奇" },
          { task: "点击商品", touchpoint: "新用户", emotion: "满意" },
        ],
      },
      {
        stage: "选择商品",
        tasks: [
          { task: "浏览商品详情", touchpoint: "新用户", emotion: "好奇" },
          { task: "加入购物车", touchpoint: "新用户", emotion: "满意" },
        ],
      },
      {
        stage: "结账",
        tasks: [
          { task: "填写收货地址", touchpoint: "新用户", emotion: "紧张" },
          { task: "支付订单", touchpoint: "新用户", emotion: "满意" },
        ],
      },
    ],
  });

  const [chatgptResponse, setChatgptResponse] = useState("");

  const scrollOutputRef: any = useRef();
  useEffect(() => {
    scrollOutputRef.current.scrollTop = scrollOutputRef.current.scrollHeight;
  }, [scrollOutputRef?.current?.scrollHeight]);

  const toast = useToast();

  const handleGenerate = async () => {
    let messages: ChatMessage[] = [];
    if (prompt1 !== "") {
      messages.push({ role: "assistant", content: prompt1 });
    }
    if (prompt2 !== "") {
      messages.push({ role: "user", content: prompt2 });
    }
    if (userInput !== "") {
      messages.push({ role: "user", content: userInput });
    }
    callChatGPT(messages);
    // if (await isJourneyDataValid(userInput)) {
    //   debouncedSetJourneyData(new JourneyFileParser(userInput).getJourney());
    // }
  };

  const debouncedSetJourneyData = useMemo(() => debounced(setJourneyData), []);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const callChatGPT = async (messages: ChatMessage[]) => {
    const response = await fetch("/api/generate", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(messages),
    });

    let responseMessage = "";
    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    while (true) {
      // @ts-ignore
      const { done, value } = await reader?.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value);
      responseMessage += chunk;
      setChatgptResponse(responseMessage);

      // stream update data
      if (isJourneyDataValid(responseMessage)) {
        debouncedSetJourneyData(
          new JourneyFileParser(responseMessage).getJourney()
        );
      }
    }
    // final update data
    if (isJourneyDataValid(responseMessage)) {
      setJourneyData(new JourneyFileParser(responseMessage).getJourney());
    }
  };

  const isJourneyDataValid = (payload: string) => {
    try {
      new JourneyFileParser(payload);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Box>
      <Navbar></Navbar>
      <Container px="0" w="960px" centerContent>
        <Box px="8px" color="black">
          <VStack align="stretch">
            <Flex mt="24px" mb="12px" alignItems="center" gap="6px">
              <Icon color="#CC850A" as={FiSun} />
              <Text>
                Hi, you can generate a user journey map just by entering the
                prompt. Give it a try now!
              </Text>
            </Flex>
            <Heading size="sm">Prompt 1 (role: assistant)</Heading>
            <Textarea
              h="256px"
              borderColor="gray.400"
              value={prompt1}
              onChange={(e) => setPrompt1(e.target.value)}
            />
            <Heading size="sm">Prompt 2 (role: user)</Heading>
            <Textarea
              borderColor="gray.400"
              value={prompt2}
              onChange={(e) => setPrompt2(e.target.value)}
            />
            <Heading size="sm">User Input (role: user)</Heading>
            <Textarea
              borderColor="gray.400"
              placeholder="Here is a sample placeholder"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              w="84px"
              size="sm"
              colorScheme="purple"
              onClick={handleGenerate}
            >
              Generate
            </Button>

            <Text
              ref={scrollOutputRef}
              background="gray.50"
              whiteSpace="pre"
              h="200px"
              overflow="scroll"
              w="960px"
              borderRadius="8px"
              borderColor="gray.400 !important"
              border="1px solid"
              p="8px 16px"
            >
              {chatgptResponse}
            </Text>

            <Box
              overflow="scroll"
              minH="240px"
              w="960px"
              borderRadius="8px"
              borderColor="gray.400 !important"
              border="1px solid rgba(0, 0, 0, 0.06)"
            >
              <Box>
                <JourneyHeaderWidget
                  header={journeyData.header}
                ></JourneyHeaderWidget>
                <JourneyMatrix stages={journeyData.stages}></JourneyMatrix>
              </Box>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
