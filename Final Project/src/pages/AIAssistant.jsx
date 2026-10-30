
import ChatBox from "../components/ChatBox";

const AIAssistant = ({ role }) => {
  const isCompany = role === "company";

  return (
    <ChatBox
      key={role}
      endpoint={
        isCompany
          ? "/api/ai/chat/mentors"
          : "/api/ai/chat/jobs"
      }
      title="AI Assistant"
      placeholder="Напишете прашање..."
    />
  );
};

export default AIAssistant;
