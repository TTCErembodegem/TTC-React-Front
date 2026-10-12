using Ttc.Model.Matches;

namespace Ttc.UnitTests;

public class MatchHideTests
{
    private static readonly TimeZoneInfo BelgianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");
    private static DateTime BelgianNow => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, BelgianTimeZone);

    private static Match CreateMatch(DateTime date)
    {
        var match = new Match { Date = date, Block = "Captain" };
        match.Players.Add(new MatchPlayer());
        return match;
    }

    [Fact]
    public void HidesFormation_MoreThan30MinutesBeforeStart()
    {
        var match = CreateMatch(BelgianNow.AddMinutes(45));

        match.Hide();

        Assert.Empty(match.Players);
        Assert.Equal("", match.Block);
    }

    [Fact]
    public void ShowsFormation_Within30MinutesOfStart_InBelgianTime()
    {
        var match = CreateMatch(BelgianNow.AddMinutes(20));

        match.Hide();

        Assert.Single(match.Players);
        Assert.Equal("Captain", match.Block);
    }

    [Fact]
    public void ShowsPlayers_WhenGamesHaveBeenSynced()
    {
        var match = CreateMatch(BelgianNow.AddHours(3));
        match.Games.Add(new MatchGame());

        match.Hide();

        Assert.Single(match.Players);
    }

    [Fact]
    public void OtherMatch_ShowsPlayers_WhenGamesHaveBeenSynced()
    {
        var match = new OtherMatch { Date = BelgianNow.AddHours(3) };
        match.Players.Add(new MatchPlayer());
        match.Games.Add(new MatchGame());

        match.Hide();

        Assert.Single(match.Players);
    }
}
