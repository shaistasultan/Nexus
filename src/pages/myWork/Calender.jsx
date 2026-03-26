import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calender = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });

  // Modal + Form State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  // Save events
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Add Event
  const handleDateClick = (arg) => {
    setEditMode(false);
    setSelectedDate(arg.dateStr);
    setTitle("");
    setTime("");
    setShowModal(true);
  };

  // Edit Event
  const handleEventClick = (clickInfo) => {
    setEditMode(true);
    setCurrentEventId(clickInfo.event.id);
    setTitle(clickInfo.event.title);
    setSelectedDate(clickInfo.event.startStr?.split("T")[0] || "");
    setTime(clickInfo.event.startStr?.split("T")[1]?.slice(0, 5) || "");
    setShowModal(true);
  };

  // Save (Add / Update)
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editMode) {
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === currentEventId
            ? {
                ...evt,
                title: title.trim(),
                start: time ? `${selectedDate}T${time}` : selectedDate,
                allDay: !time,
              }
            : evt,
        ),
      );
    } else {
      const newEvent = {
        id: String(Date.now()),
        title: title.trim(),
        start: time ? `${selectedDate}T${time}` : selectedDate,
        allDay: !time,
        status: "pending",
      };

      setEvents((prev) => [...prev, newEvent]);
    }

    closeModal();
  };

  // Confirm Slot
  const handleConfirm = () => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === currentEventId ? { ...evt, status: "confirmed" } : evt,
      ),
    );
    closeModal();
  };

  // Delete
  const handleDelete = () => {
    setEvents((prev) => prev.filter((evt) => evt.id !== currentEventId));
    closeModal();
  };

  // Drag update
  const handleEventChange = (info) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === info.event.id ? { ...evt, start: info.event.startStr } : evt,
      ),
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setTime("");
    setCurrentEventId(null);
  };

  // Confirmed list
  const confirmedEvents = events.filter((evt) => evt.status === "confirmed");

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* CALENDAR */}
      <div className="bg-white rounded-2xl shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          editable={true}
          height="75vh"
          // 🎨 CUSTOM EVENT UI
          eventContent={(arg) => {
            const isConfirmed = arg.event.extendedProps.status === "confirmed";

            return (
              <div
                className={`px-2 py-1 rounded-lg text-xs shadow-sm flex items-center gap-1 ${
                  isConfirmed
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                <span>{isConfirmed ? "✅" : "⏳"}</span>
                <div className="flex flex-col leading-tight ">
                  <span className="font-semibold">{arg.timeText}</span>
                  <span className="truncate">{arg.event.title}</span>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* CONFIRMED EVENTS */}
      <div className="mt-6 bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-3">Confirmed Meetings</h2>

        {confirmedEvents.length === 0 ? (
          <p className="text-gray-500">No confirmed slots yet</p>
        ) : (
          <ul className="space-y-2">
            {confirmedEvents.map((evt) => (
              <li
                key={evt.id}
                className="p-3 rounded-lg bg-green-50 border border-green-200"
              >
                <p className="font-medium text-green-800">{evt.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(evt.start).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-[1000]"
          onClick={closeModal}
        >
          <div
            className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">
              {editMode ? "Edit Event" : "Add Event"}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {new Date(selectedDate).toDateString()}
            </p>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white"
              >
                {editMode ? "Update" : "Create"}
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-3 rounded-xl bg-green-600 text-white"
                >
                  Confirm Slot
                </button>
              )}

              <div className="flex gap-2">
                {editMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-xl bg-red-100 text-red-600"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
