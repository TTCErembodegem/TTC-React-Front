namespace Ttc.Model.Core;

internal static class Helpers
{
    /// <summary>
    /// A match is considered started this time before the official start time
    /// </summary>
    private static readonly TimeSpan MatchStarts = new(0, 30, 0);
    private static readonly TimeZoneInfo BelgianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");

    /// <summary>
    /// Match dates are Belgian local time while the server runs in UTC
    /// </summary>
    private static DateTime BelgianNow => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, BelgianTimeZone);

    public static bool HasMatchStarted(DateTime date) => date - BelgianNow < MatchStarts;
}
