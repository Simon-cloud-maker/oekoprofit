# Prompt Evaluation Guide

Use this folder to evaluate prompt versions consistently.

## Files

- `scorecard-stage-01-concept.md`
- `scorecard-stage-02-repository.md`
- `scorecard-stage-03-feature.md`
- `experiment-log-template.md`

## Process

1. Run both `v1` and `v2` prompts for the same stage.
2. Score each output with the stage scorecard.
3. Record observations in the experiment log.
4. Promote the better prompt version and note why in `prompts/CHANGELOG.md`.

## Scoring Recommendation

- 0 = missing or incorrect
- 1 = partial or weak
- 2 = mostly good
- 3 = complete and high quality

You can convert to a percent score:

`(sum of points / max points) * 100`
