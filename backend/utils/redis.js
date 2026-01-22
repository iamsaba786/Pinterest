import Redis from "ioredis";

const redisClient = new Redis({
  host: "redis-13462.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  port: 13462,
  password: "CqaKbZ17DG7kyd9cqhgqvVunPvTGoMBW",
});

redisClient.on("connect", () => {
  console.log("✅ Redis Cloud Connected!");
});

export default redisClient;
