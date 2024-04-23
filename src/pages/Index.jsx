import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Textarea, Stack, IconButton, Flex, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:1337/api/events";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEvents(data.data);
  };

  const createEvent = async () => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name,
          description,
        },
      }),
    });

    if (response.ok) {
      setName("");
      setDescription("");
      fetchEvents();
      toast({
        title: "Event created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateEvent = async () => {
    const response = await fetch(`${API_URL}/${editingEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name,
          description,
        },
      }),
    });

    if (response.ok) {
      setName("");
      setDescription("");
      setEditingEvent(null);
      fetchEvents();
      toast({
        title: "Event updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchEvents();
      toast({
        title: "Event deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" textAlign="center" marginBottom={8}>
        Event Management
      </Heading>

      <Stack spacing={4} marginBottom={8}>
        <Input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button colorScheme="blue" onClick={editingEvent ? updateEvent : createEvent}>
          {editingEvent ? "Update Event" : "Create Event"}
        </Button>
      </Stack>

      <Stack spacing={4}>
        {events.map((event) => (
          <Box key={event.id} borderWidth={1} borderRadius="md" padding={4} backgroundColor="gray.100">
            <Flex justify="space-between" align="center">
              <Box>
                <Heading as="h2" size="md">
                  {event.attributes.name}
                </Heading>
                <Text>{event.attributes.description}</Text>
              </Box>
              <Box>
                <IconButton
                  icon={<FaEdit />}
                  marginRight={2}
                  onClick={() => {
                    setName(event.attributes.name);
                    setDescription(event.attributes.description);
                    setEditingEvent(event);
                  }}
                />
                <IconButton icon={<FaTrash />} onClick={() => deleteEvent(event.id)} />
              </Box>
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;
