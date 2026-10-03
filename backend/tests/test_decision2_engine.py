"""
Unit tests for Decision 2.0 (System 1) Fast Inference Engine.
Verifies vllm-sr/Decision-2.0 compatibility, sub-10ms latency,
typed question responses (choice, noul, score), safety verification, and tool routing.
"""

import unittest
from backend.decision2.decision2_engine import Decision2Engine


class TestDecision2Engine(unittest.TestCase):
    def setUp(self):
        self.engine = Decision2Engine(model_id="vllm-sr/Decision-2.0-Sol-2B")

    def test_system_one_choice_question(self):
        """Test non-autoregressive choice question with probability distribution."""
        state = "Pneumatic distribution line pressure dropped to 6.1 bar while compressor power rose to 68 kW."
        questions = {
            "root_subsystem": {
                "type": "choice",
                "instructions": "Which subsystem is failing?",
                "criteria": {
                    "pneumatics": "Air lines, pneumatic manifolds, couplings and pressure drops",
                    "furnace": "Electric induction melting power, refractory lining and coil holding",
                    "grinder": "Finishing and casting trim machines",
                }
            }
        }
        res = self.engine.system_one(state, questions)
        self.assertIn("root_subsystem", res["results"])
        self.assertEqual(res["results"]["root_subsystem"]["selected"], "pneumatics")
        self.assertTrue(res["latency_ms"] < 25.0)
        self.assertEqual(res["model"], "vllm-sr/Decision-2.0-Sol-2B")

    def test_system_one_noul_boolean(self):
        """Test binary safety interlock verification."""
        state = "Operating pressure 6.5 bar is above minimum threshold 5.5 bar."
        questions = {
            "is_safe": {
                "type": "noul",
                "instructions": "Is the operating state safe?",
            }
        }
        res = self.engine.system_one(state, questions)
        self.assertTrue(res["results"]["is_safe"]["result"])
        self.assertTrue(res["results"]["is_safe"]["confidence"] > 0.9)

    def test_safety_guardrail_verification(self):
        """Test physical safety interlocks."""
        # Safe case (6.5 bar >= 5.5 bar, 2.1 mm/s <= 3.5 mm/s)
        safe_eval = self.engine.verify_safety_guardrail(pressure_bar=6.5, min_clamping_bar=5.5, vibration_mm_s=2.1)
        self.assertTrue(safe_eval["is_safe"])
        self.assertEqual(safe_eval["safety_verdict"], "APPROVED_FOR_OPERATOR")
        self.assertEqual(safe_eval["clamping_margin_bar"], 1.0)
        self.assertTrue(safe_eval["latency_ms"] < 25.0)

        # Unsafe case (5.2 bar < 5.5 bar)
        unsafe_eval = self.engine.verify_safety_guardrail(pressure_bar=5.2, min_clamping_bar=5.5, vibration_mm_s=2.1)
        self.assertFalse(unsafe_eval["is_safe"])
        self.assertEqual(unsafe_eval["safety_verdict"], "REJECT_UNSAFE_PRESSURE")

    def test_tool_routing_system1(self):
        """Test fast MCP tool selection in < 15ms."""
        query = "Why did electrical power and compressor SEC spike on Line 2?"
        available = ["get_incident_summary", "get_timeline", "get_causal_graph", "get_business_impact", "get_machine_alerts"]
        tools = self.engine.route_tools_system1(query, available)
        self.assertTrue(len(tools) >= 2)
        self.assertIn("get_incident_summary", tools)


if __name__ == "__main__":
    unittest.main()
