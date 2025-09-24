const SimpleAlert = ({ type = "info", title, message, onClose }) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#f0fdf4",
          borderColor: "#bbf7d0",
          color: "#166534",
          borderLeftColor: "#22c55e",
        };
      case "error":
        return {
          backgroundColor: "#fef2f2",
          borderColor: "#fecaca",
          color: "#dc2626",
          borderLeftColor: "#ef4444",
        };
      case "warning":
        return {
          backgroundColor: "#fffbeb",
          borderColor: "#fed7aa",
          color: "#d97706",
          borderLeftColor: "#f59e0b",
        };
      default:
        return {
          backgroundColor: "#eff6ff",
          borderColor: "#bfdbfe",
          color: "#1d4ed8",
          borderLeftColor: "#3b82f6",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  const styles = getStyles();

  return (
    <div
      style={{
        ...styles,
        border: `1px solid ${styles.borderColor}`,
        borderLeft: `4px solid ${styles.borderLeftColor}`,
        borderRadius: "6px",
        padding: "12px 16px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "flex-start",
        maxWidth: "400px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <span
        style={{ marginRight: "8px", fontSize: "16px", fontWeight: "bold" }}
      >
        {getIcon()}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <h4
            style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "14px" }}
          >
            {title}
          </h4>
        )}
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.4" }}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            marginLeft: "8px",
            fontSize: "16px",
            opacity: 0.7,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SimpleAlert;
