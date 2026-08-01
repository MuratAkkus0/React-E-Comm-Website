import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema } from "@ecomm/shared";
import { useLoginMutation } from "../../api/authApi";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import "./auth.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      await login(result.data).unwrap();
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message ?? "Invalid email or password.");
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Email" error={errors.email}>
            {(id) => (
              <input
                id={id}
                className="ui-input"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
              />
            )}
          </Field>
          <Field label="Password" error={errors.password}>
            {(id) => (
              <input
                id={id}
                className="ui-input"
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete="current-password"
              />
            )}
          </Field>
          <Button type="submit" isLoading={isLoading}>
            Log in
          </Button>
        </form>
        <p className="auth-card__footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
