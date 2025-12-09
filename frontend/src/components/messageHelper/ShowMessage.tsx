import { message } from "antd";

message.config({ maxCount: 1 });

type MessageType = "success" | "error" | "warning" | "info";

//RN19 COMPONENTE GENÉRICO PARA MOSTRART AS MENSAGENS DE RETORNO DA API.
export function showMessage(text: string, type: MessageType = "info") {
  message.destroy();
  message.open({
    type,
    content: text,
    duration: 2,
  });
}
